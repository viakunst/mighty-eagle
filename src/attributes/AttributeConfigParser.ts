import {
  BooleanAttribute, CompoundTextAttribute, DateAttribute, PhoneAttribute, TextAttribute,
} from './types';
import { AttributeConfigDefinition, ConfigContext } from './AttributeConfigData';
import AttributeInstance from './AttributeInstance';
import ConfigAdapter from '../adapters/config/ConfigAdapter';
import EmailAttribute from './types/PhoneAttribute';

function valid(object: any, key: string | number, type: string, required: boolean = true) {
  if (key in object) {
    if (typeof object[key] !== type) return false;
  } else if (required) {
    return false;
  }

  // all checks passed
  return true;
}

export default class AttributeConfigParser {
  static parse(jsonConfig: string): AttributeInstance<any>[] {
    const data = JSON.parse(jsonConfig);
    const attrs = this.validate(data);
    return this.compile(attrs);
  }

  static validate(data: any): AttributeConfigDefinition {
    if (!(data instanceof Array)) {
      return [];
    }
    return data.flatMap((attribute) => {
      // validate keys
      if (!valid(attribute, 'type', 'string')) { return []; }
      if (!valid(attribute, 'name', 'string')) { return []; }
      if (!valid(attribute, 'context', 'object')) { return []; }
      if (!valid(attribute, 'attribute', 'string')) { return []; }
      if (!valid(attribute, 'description', 'string', false)) { return []; }

      // validate type
      if (!['string', 'boolean', 'date', 'phone', 'email', 'compound'].includes(attribute.type)) { return []; }

      // validate context
      if (!(attribute.context instanceof Array)) { return []; }
      if (attribute.context.every((elem: any) => elem in ConfigContext)) { return []; }

      // validated
      return [attribute];
    });
  }

  static compile(data: AttributeConfigDefinition): AttributeInstance<any>[] {
    return data.map((attribute) => {
      switch (attribute.type) {
        case 'string':
          return TextAttribute(attribute);
        case 'boolean':
          return BooleanAttribute(attribute);
        case 'date':
          return DateAttribute(attribute);
        case 'phone':
          return PhoneAttribute(attribute);
        case 'email':
          return EmailAttribute(attribute);
        case 'compound':
          return CompoundTextAttribute(attribute);
        default:
          throw new Error();
      }
    });
  }

  static async resolve(config: ConfigAdapter, context: ConfigContext) {
    return this.compile(await config.get(context));
  }
}

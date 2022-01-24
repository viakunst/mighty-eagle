import {
  BooleanAttribute, CompoundTextAttribute, DateAttribute,
  PhoneAttribute, TextAttribute, EmailAttribute,
} from './types';
import { AttributeConfigDefinition, ConfigContext, AttributeTypes } from './AttributeConfigData';
import AttributeInstance from './AttributeInstance';
import ConfigAdapter from '../adapters/config/ConfigAdapter';

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
      if (!valid(attribute, 'options', 'object', false)) { return []; }

      // validate type
      if (!Object.values(AttributeTypes).includes(attribute.type)) { return []; }

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
        case AttributeTypes.TEXT:
          return TextAttribute(attribute);
        case AttributeTypes.CHECKBOX:
          return BooleanAttribute(attribute);
        case AttributeTypes.DATE:
          return DateAttribute(attribute);
        case AttributeTypes.PHONE:
          return PhoneAttribute(attribute);
        case AttributeTypes.EMAIL:
          return EmailAttribute(attribute);
        case AttributeTypes.COMPOUND_TEXT:
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

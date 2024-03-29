import {
  BooleanAttribute, CompoundTextAttribute, DateAttribute,
  PhoneAttribute, TextAttribute, EmailAttribute, TextAreaAttribute,
} from './types';
import { AttributeConfigDefinition, ConfigContext, AttributeTypes } from './AttributeConfigData';
import AttributeInstance from './AttributeInstance';
import ConfigAdapter from '../adapters/config/ConfigAdapter';

function valid(object: any, key: string | number, type: string, required = true) {
  if (key in object) {
    if (typeof object[key] !== type) return false;
  } else if (required) {
    return false;
  }

  // all checks passed
  return true;
}

export default class AttributeConfigParser {
  static parse(jsonConfig: any): AttributeConfigDefinition {
    return this.validate(jsonConfig.config);
  }

  static validate(data: any): AttributeConfigDefinition {
    if (!(data instanceof Array)) {
      return [];
    }
    return data.flatMap((attribute) => {
      // validate keys
      if (!this.validateKeys(attribute)) {
        return [];
      }

      // validate type
      if (!Object.values(AttributeTypes).includes(attribute.type)) { return []; }

      // validate context
      if (!(attribute.context instanceof Array)) { return []; }

      if (!attribute.context.every((elem: any) => Object.values(ConfigContext).includes(elem))) {
        return [];
      }

      // validated
      return [attribute];
    });
  }

  static validateKeys(attribute: any): any {
    if (!valid(attribute, 'type', 'string')) { return false; }
    if (!valid(attribute, 'name', 'string')) { return false; }
    if (!valid(attribute, 'context', 'object')) { return false; }
    if (!valid(attribute, 'attribute', 'string')) { return false; }
    if (!valid(attribute, 'description', 'string', false)) { return false; }
    if (!valid(attribute, 'options', 'object', false)) { return false; }
    return true;
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
        case AttributeTypes.TEXTAREA:
          return TextAreaAttribute(attribute);
        default:
          throw new Error();
      }
    });
  }

  static async resolve(config: ConfigAdapter, context: ConfigContext) {
    return this.compile(await config.get(context));
  }
}

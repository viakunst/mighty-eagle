import { BooleanAttribute, TextAttribute } from './types';
import AttributeConfigData, { ConfigContext } from './AttributeConfigData';
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

  static validate(data: any): AttributeConfigData[] {
    if (!(data instanceof Array)) {
      return [];
    }
    return data.flatMap((attribute) => {
      // validate keys
      if (!valid(attribute, 'Type', 'string')) { return []; }
      if (!valid(attribute, 'Name', 'string')) { return []; }
      if (!valid(attribute, 'Context', 'object')) { return []; }
      if (!valid(attribute, 'Attribute', 'string')) { return []; }
      if (!valid(attribute, 'Description', 'string', false)) { return []; }

      // validate type
      if (!['string', 'boolean'].includes(attribute.Type)) { return []; }

      // validate context
      if (!(attribute.Context instanceof Array)) { return []; }
      if (attribute.Context.every((elem: any) => elem in ConfigContext)) { return []; }

      // validated
      return [attribute];
    });
  }

  static compile(data: AttributeConfigData[]): AttributeInstance<any>[] {
    return data.map((attribute) => {
      switch (attribute.Type) {
        case 'string':
          return TextAttribute(attribute);
        case 'boolean':
          return BooleanAttribute(attribute);
        default:
          throw new Error();
      }
    });
  }

  static async resolve(config: ConfigAdapter, context: ConfigContext) {
    return this.compile(await config.get(context));
  }
}

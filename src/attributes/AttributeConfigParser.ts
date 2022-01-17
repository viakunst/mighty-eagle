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
    const attrs = this.validate(jsonConfig);
    return this.compile(attrs);
  }

  static validate(jsonConfig: string): AttributeConfigData[] {
    const data = JSON.parse(jsonConfig);
    if (!(data instanceof Array)) {
      return [];
    }
    return data.flatMap((attribute) => {
      if (!valid(attribute, 'Type', 'string')) { return []; }
      if (!valid(attribute, 'Name', 'string')) { return []; }
      if (!valid(attribute, 'Attribute', 'string')) { return []; }
      if (!valid(attribute, 'Description', 'string', false)) { return []; }
      if (!['string', 'boolean'].includes(attribute.Type)) { return []; }
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

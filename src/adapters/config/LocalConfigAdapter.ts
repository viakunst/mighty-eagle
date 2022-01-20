import { AttributeConfigDefinition, ConfigContext } from '../../attributes/AttributeConfigData';
import ConfigAdapter from './ConfigAdapter';

/* eslint class-methods-use-this:0 */
export default class LocalConfigAdapter implements ConfigAdapter {
  config: AttributeConfigDefinition;

  constructor(config: AttributeConfigDefinition) {
    this.config = config;
  }

  canUpdate(): boolean {
    return false;
  }

  update(): Promise<void> {
    throw new Error('updating the hardcoded configuration is not supported');
  }

  get(context: ConfigContext): Promise<AttributeConfigDefinition> {
    return new Promise((resolve) => {
      const filtered = this.config.filter((attr) => attr.context.includes(context));
      resolve(filtered);
    });
  }
}

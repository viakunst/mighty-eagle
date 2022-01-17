import AttributeConfigData, { ConfigContext } from '../../attributes/AttributeConfigData';
import ConfigAdapter from './ConfigAdapter';

/* eslint class-methods-use-this:0 */
export default class LocalConfigAdapter implements ConfigAdapter {
  config: AttributeConfigData[];

  constructor(config: AttributeConfigData[]) {
    this.config = config;
  }

  canUpdate(): boolean {
    return false;
  }

  update(): Promise<void> {
    throw new Error('updating the hardcoded configuration is not supported');
  }

  get(context: ConfigContext): Promise<AttributeConfigData[]> {
    return new Promise((resolve) => {
      const filtered = this.config.filter((attr) => attr.Context.includes(context));
      resolve(filtered);
    });
  }
}

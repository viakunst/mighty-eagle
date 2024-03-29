import { AttributeConfigDefinition, ConfigContext } from '../../attributes/AttributeConfigData';
import AttributeConfigParser from '../../attributes/AttributeConfigParser';
import ConfigAdapter from './ConfigAdapter';

/* eslint class-methods-use-this:0 */
export default class LocalConfigAdapter implements ConfigAdapter {
  url: string;

  sameOrigin: boolean;

  config?: AttributeConfigDefinition;

  constructor(url: string, sameOrigin = true) {
    this.url = url;
    this.sameOrigin = sameOrigin;
  }

  canUpdate(): boolean {
    return false;
  }

  update(): Promise<void> {
    throw new Error('updating the hardcoded configuration is not supported');
  }

  async get(context: ConfigContext): Promise<AttributeConfigDefinition> {
    if (!this.config) {
      const response = await fetch(this.url, { mode: this.sameOrigin ? undefined : 'cors' });
      const data = await response.json();
      this.config = AttributeConfigParser.parse(data);
    }
    return this.config.filter((attr) => attr.context.includes(context));
  }
}

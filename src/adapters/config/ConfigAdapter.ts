import AttributeConfigData, { ConfigContext } from '../../attributes/AttributeConfigData';

export default interface ConfigAdapter {
  update(context: ConfigContext, config: AttributeConfigData[]): Promise<void>;
  get(context: ConfigContext): Promise<AttributeConfigData[]>;
}

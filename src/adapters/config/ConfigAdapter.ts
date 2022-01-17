import AttributeConfigData, { ConfigContext } from '../../attributes/AttributeConfigData';

export default interface ConfigAdapter {
  canUpdate(): boolean;
  update(context: ConfigContext, config: AttributeConfigData[]): Promise<void>;
  get(context: ConfigContext): Promise<AttributeConfigData[]>;
}

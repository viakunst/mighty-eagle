import { AttributeConfigDefinition, ConfigContext } from '../../attributes/AttributeConfigData';

export default interface ConfigAdapter {
  canUpdate(): boolean;
  update(context: ConfigContext, config: AttributeConfigDefinition): Promise<void>;
  get(context: ConfigContext): Promise<AttributeConfigDefinition>;
}

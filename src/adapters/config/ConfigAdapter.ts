import AttributeConfigData from '../../attributes/AttributeConfigData';

export default interface ConfigAdapter {
  update(context: ConfigContext, config: AttributeConfigData[]): Promise<void>;
  get(context: ConfigContext): Promise<AttributeConfigData[]>;
}

export enum ConfigContext {
  USER_READ = 'USER_READ',
  USER_MUTATE = 'USER_MUTATE',
  ADMIN_READ = 'ADMIN_READ',
  ADMIN_MUTATE = 'ADMIN_MUTATE',
}

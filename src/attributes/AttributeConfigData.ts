export default interface AttributeConfigData {
  type: string;
  context: ConfigContext[];
  name: string,
  attribute: string,
  description?: string,
}

export enum ConfigContext {
  USER_READ = 'USER_READ',
  USER_MUTATE = 'USER_MUTATE',
  ADMIN_READ = 'ADMIN_READ',
  ADMIN_MUTATE = 'ADMIN_MUTATE',
}

export default interface AttributeConfigData {
  Type: string;
  Context: ConfigContext[];
  Name: string,
  Attribute: string,
  Description?: string,
}

export enum ConfigContext {
  USER_READ = 'USER_READ',
  USER_MUTATE = 'USER_MUTATE',
  ADMIN_READ = 'ADMIN_READ',
  ADMIN_MUTATE = 'ADMIN_MUTATE',
}

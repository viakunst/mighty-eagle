export default interface AttributeConfigData<T> {
  name: string,
  attribute: string,
  description?: string,
  options: T
}

export type AttributeConfigDefinition = (AttributeConfigData<any> & {
  type: string;
  context: ConfigContext[];
})[];

export enum ConfigContext {
  USER_READ = 'USER_READ',
  USER_MUTATE = 'USER_MUTATE',
  ADMIN_READ = 'ADMIN_READ',
  ADMIN_MUTATE = 'ADMIN_MUTATE',
}

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
  ADMIN_MENU = 'ADMIN_MENU',
  ADMIN_MENU_SEARCHABLE = 'SEARCHABLE',
}

export enum AttributeTypes {
  EMAIL = 'email',
  TEXT = 'string',
  TEXTAREA = 'textarea',
  CHECKBOX = 'boolean',
  DATE = 'date',
  PHONE = 'phone',
  COMPOUND_TEXT = 'compound',
  MENU_ATTRIBUTE = 'menu',
}

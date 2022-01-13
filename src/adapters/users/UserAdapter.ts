export type UserAttributes = Record<string, string | null>;

export type Username = string;

export default interface UserAdapter {
  id: string;

  listUsers(filter?: string): Promise<User[]>;
  getUser(username: Username): Promise<User | null>;
  createUser(username: Username, userAttributes: UserAttributes): Promise<void>;
  deleteUser(username: Username): Promise<void>;
  updateUser(username: Username, userAttributes: UserAttributes): Promise<void>;
  userSetEnabled(username: Username, enabled: boolean): Promise<void>;
}

export interface User {
  username: Username;
  userAttributes: UserAttributes;
  status?: string,
  created?: Date,
  modified?: Date,
  enabled?: boolean
}

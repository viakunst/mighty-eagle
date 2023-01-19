import { ReactElement } from 'react';
import {
  FormInstance,
} from 'antd';
import { ColumnType } from 'antd/lib/table';
import { UserAttributes } from '../adapters/users/UserAdapter';

interface UserPoolUser {
  username: string,
  userAttributes: UserAttributes,
  status: string,
  created: string,
  modified: string,
  enabled: string
}

export default interface AttributeInstance<T> {
  attribute: string;
  name: string;
  view: (userData: UserAttributes) => { title: string, key: string, value: JSX.Element };
  edit: (value: string | null) => ReactElement;
  menu: () => ColumnType<UserPoolUser>;
  parse: (serialized: string) => T,
  serialize: (value: T) => string,
  fromForm?: (form: FormInstance) => T,
}

import { ReactElement } from 'react';
import {
  FormInstance,
} from 'antd';
import { UserAttributes } from '../adapters/users/UserAdapter';

export default interface AttributeInstance<T> {
  attribute: string;
  view: (userData: UserAttributes) => { title: string, key: string, value: JSX.Element };
  edit: (value: string | null) => ReactElement;
  parse: (serialized: string) => T,
  serialize: (value: T) => string,
  fromForm?: (form: FormInstance) => T,
}

import { ReactElement } from 'react';
import { UserAttributes } from '../adapters/users/UserAdapter';

export default interface AttributeInstance<T> {
  attribute: string;
  errorMessage?: string;
  view: (userData: UserAttributes) => { title: string, key: string, value: JSX.Element };
  edit: (value:string | null) => ReactElement;
  value: (value: T) => string,
  validate: (value: any) => { succes: boolean, msg: string }
  getName: () => string,
  getAttribute: () => string,
  getDescription: () => string | undefined,
}

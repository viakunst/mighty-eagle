import React from 'react';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';

export default function MenuAttribute({
  name,
  attribute,
}: AttributeConfigData<void>): AttributeInstance<string> {
  return {
    attribute,
    name,
    view: (userData: UserAttributes) => ({
      title: name,
      key: name,
      value: (<>{userData[attribute]}</>),
    }),
    edit: (value:string | null) => (
      <>{value}</>
    ),
    menu: () => ({
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      // sorter: (a, b) => a.created.localeCompare(b.created),
      // sortDirections: ['ascend', 'descend'],
    }),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value,
  };
}

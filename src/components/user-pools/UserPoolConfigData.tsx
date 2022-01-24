import React from 'react';
import {
  Select,
} from 'antd';
import { ColumnType } from 'antd/lib/table';
import { UserAttributes } from '../../adapters/users/UserAdapter';

export default interface UserPoolUser {
  username: string,
  userAttributes: UserAttributes,
  status: string,
  created: string,
  modified: string,
  enabled: string
}

export function searchField(name: string, attribute: string) {
  return (
    <Select
      key={attribute ?? ''}
      value={attribute ?? ''}
    >
      {name}
    </Select>
  );
}

export function attributeColumn(name: string, attribute: string): ColumnType<UserPoolUser> {
  return {
    title: name,
    dataIndex: ['userAttributes', attribute],
    key: attribute,
    sorter: (a: any, b: any) => a.userAttributes.name?.localeCompare(b.userAttributes.name ?? '') ?? 0,
    sortDirections: ['ascend', 'descend'],
  };
}

export function statusColumn(): ColumnType<UserPoolUser> {
  return {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    filters: [
      {
        text: 'CONFIRMED',
        value: 'CONFIRMED',
      },
      {
        text: 'RESET_REQUIRED',
        value: 'RESET_REQUIRED',
      },
    ],
    onFilter: (value: any, record: any) => (typeof value === 'string' ? record.status.indexOf(value) === 0 : false),
    sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    sortDirections: ['ascend', 'descend'],
  };
}

export function createdColumn(): ColumnType<UserPoolUser> {
  return {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    // sorter: (a, b) => a.created.localeCompare(b.created),
    // sortDirections: ['ascend', 'descend'],
  };
}

export function modifiedColumn(): ColumnType<UserPoolUser> {
  return {
    title: 'Modified',
    dataIndex: 'modified',
    key: 'modified',
    // sorter: (a, b) => a.modified.localeCompare(b.modified),
    // sortDirections: ['ascend', 'descend'],
  };
}

export function enabledColumn(): ColumnType<UserPoolUser> {
  return {
    title: 'Enabled',
    dataIndex: 'enabled',
    key: 'enabled',
    sorter: (a, b) => a.enabled.localeCompare(b.enabled),
    sortDirections: ['ascend', 'descend'],
  };
}

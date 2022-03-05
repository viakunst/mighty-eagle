import React from 'react';
import {
  Form, Checkbox,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';

export default function BooleanAttribute({
  name,
  attribute,
  description,
}: AttributeConfigData<void>): AttributeInstance<boolean> {
  return {
    attribute,
    name,
    view: (userData: UserAttributes) => {
      let val;
      if (userData[attribute] === 'true') {
        val = <> <Checkbox defaultChecked disabled /> </>;
      } else {
        val = <Checkbox defaultChecked={false} disabled />;
      }
      return ({
        title: name,
        key: name,
        value: val,
      });
    },
    edit: (value:string | null) => (
      <Form.Item
        label={name}
        name={`attributes[${attribute}]`}
        valuePropName="checked"
        initialValue={value === 'true'}
        key={attribute}
        tooltip={description ?? undefined}
      >
        <Checkbox />
      </Form.Item>
    ),
    menu: () => ({
      title: name,
      dataIndex: ['userAttributes', attribute],
      key: attribute,
      sorter: (a: any, b: any) => a.userAttributes[attribute]?.localeCompare(b.userAttributes[attribute] ?? '') ?? 0,
      sortDirections: ['ascend', 'descend'],
    }),
    parse: (serialized: string) => {
      switch (serialized) {
        case 'true': return true;
        case 'false': return false;
        default: throw new Error();
      }
    },
    serialize: (value: boolean) => {
      if (value === true) {
        return 'true';
      }
      return 'false';
    },
  };
}

import React from 'react';
import {
  Form, Checkbox,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';

export interface BooleanOptions {
  trueLabel: string,
  falseLabel: string,
  unknownLabel: string,
}

export default function BooleanAttribute({
  name,
  attribute,
  description,
  options: {
    trueLabel,
    falseLabel,
    unknownLabel,
  },
}: AttributeConfigData<BooleanOptions>): AttributeInstance<boolean> {
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
      render: ((val:string) => {
        if (val === 'true') {
          if (trueLabel != null) {
            return trueLabel;
          }
          return 'true';
        }
        if (val === 'false') {
          if (falseLabel != null) {
            return falseLabel;
          }
          return 'false';
        }
        if (unknownLabel != null) {
          return unknownLabel;
        }
        return 'unknown';
      }),
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

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
}: AttributeConfigData): AttributeInstance<boolean> {
  return {
    attribute,
    view: (userData: UserAttributes) => {
      let val;
      if (userData[attribute] === 'false') {
        val = <Checkbox defaultChecked={false} disabled />;
      } else {
        val = <> <Checkbox defaultChecked disabled /> </>;
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

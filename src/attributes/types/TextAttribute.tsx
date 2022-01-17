import React from 'react';
import {
  Form, Input,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';

export default function TextAttribute({
  name,
  attribute,
  description,
}: AttributeConfigData): AttributeInstance<string> {
  return {
    attribute,
    view: (userData: UserAttributes) => ({
      title: name,
      key: name,
      value: (<>{userData[attribute]}</>),
    }),
    edit: (value:string | null) => (
      <Form.Item
        label={name}
        required={false}
        key={attribute}
        name={`attributes[${attribute}]`}
        initialValue={value ?? undefined}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{
          required: false,
          whitespace: true,
        }]}
        tooltip={description ?? undefined}
      >
        <Input style={{ width: '60%', marginRight: 8 }} />
      </Form.Item>
    ),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value,
  };
}

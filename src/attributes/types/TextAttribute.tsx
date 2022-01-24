import React from 'react';
import {
  Form, Input,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';

export interface TextOptions {
  required: boolean,
  placeholder: string,
}

export default function TextAttribute({
  name,
  attribute,
  description,
  options: {
    required,
    placeholder,
  },
}: AttributeConfigData<TextOptions>): AttributeInstance<string> {
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
        required={required || false}
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
        <Input placeholder={placeholder ?? undefined} style={{ width: '80%', marginRight: 8 }} />
      </Form.Item>
    ),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value,
  };
}

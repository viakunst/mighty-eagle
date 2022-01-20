import React from 'react';
import {
  Form, Input,
} from 'antd';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';
import TextAttribute, { TextOptions } from './TextAttribute';

type EmailOptions = TextOptions & {
  message: string,
};

export default function EmailAttribute({
  name,
  attribute,
  description,
  options: {
    required,
    placeholder,
    message,
  },
}: AttributeConfigData<EmailOptions>): AttributeInstance<string> {
  const Base = TextAttribute({
    name,
    attribute,
    description,
    options: {
      required,
      placeholder,
    },
  });
  Base.edit = (value:string | null) => (
    <Form.Item
      label={name}
      required={required || false}
      key={attribute}
      name={`attributes[${attribute}]`}
      initialValue={value ?? undefined}
      validateTrigger={['onChange', 'onBlur']}
      rules={[{
        required: false,
        whitespace: false,
        type: 'email',
        message,
      }]}
      tooltip={description ?? undefined}
    >
      <Input placeholder={placeholder ?? undefined} style={{ width: '60%', marginRight: 8 }} />
    </Form.Item>
  );
  return Base;
}

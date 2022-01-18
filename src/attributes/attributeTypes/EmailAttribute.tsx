import React from 'react';
import {
  Form, Input,
} from 'antd';
import AttributeInstance from '../attributesClass/AttributeInstance';
import AttributeConfigData from '../attributesClass/AttributeConfigData';
import TextAttribute from './TextAttribute';

export default function EmailAttribute({
  Name,
  Attribute,
  Description,
  Required,
  Placeholder,
  Message,
}: AttributeConfigData): AttributeInstance<string> {
  const Base = TextAttribute({
    Name,
    Attribute,
    Description,
    Required,
    Placeholder,
  });
  Base.edit = (value:string | null) => (
    <Form.Item
      label={Name}
      required={Required || false}
      key={Attribute}
      name={`attributes[${Attribute}]`}
      initialValue={value ?? undefined}
      validateTrigger={['onChange', 'onBlur']}
      rules={[{
        required: false,
        whitespace: false,
        type: 'email',
        message: Message,
      }]}
      tooltip={Description ?? undefined}
    >
      <Input placeholder={Placeholder ?? undefined} style={{ width: '60%', marginRight: 8 }} />
    </Form.Item>
  );
  return Base;
}

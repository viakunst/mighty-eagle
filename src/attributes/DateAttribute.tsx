import React from 'react';
import {
  Form, Input,
} from 'antd';
import BaseAttribute from './BaseAttribute';

export default function DateAttribute({
  Name, Attribute, Description, Required, Placeholder,
}: any) {
  const att = BaseAttribute({
    Name, Attribute, Description, Required, Placeholder,
  });
  att.edit = (value:string | null) => (
    <Form.Item
      label={Name}
      name={`attributes[${Attribute}]`}
      initialValue={value}
      validateTrigger={['onChange', 'onBlur']}
      rules={[{
        required: false,
        whitespace: true,
      }]}
    >
      <Input style={{ width: '60%', marginRight: 8 }} />
    </Form.Item>
  );
  console.log(att);
  return att;
}

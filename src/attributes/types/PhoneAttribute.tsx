import React from 'react';
import {
  Form, Input,
} from 'antd';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';
import TextAttribute, { TextOptions } from './TextAttribute';

export default function EmailAttribute({
  name,
  attribute,
  description,
  options: {
    required,
    placeholder,
  },
}: AttributeConfigData<TextOptions>): AttributeInstance<string> {
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
        whitespace: false,
      },
      {
        validator: async (rule, input) => {
          // Alleen nederlandse nummers tot nu toe.
          if (input.substring(0, 4) !== '+316') {
            return Promise.reject(new Error('Het nummer moet starten met +316.'));
          }
          const isnum = /^\d+$/.test(input.substring(4));

          if (input.length > 4 && !isnum) {
            return Promise.reject(new Error('Het nummer bevat andere symbolen.'));
          }
          if (!input || input.length !== 12) {
            return Promise.reject(new Error('Het nummer is niet lang genoeg.'));
          }

          return Promise.resolve();
        },
      }]}
      tooltip={description ?? undefined}
    >
      <Input placeholder={placeholder ?? undefined} style={{ width: '60%', marginRight: 8 }} />
    </Form.Item>
  );
  return Base;
}

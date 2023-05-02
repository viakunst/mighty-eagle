import React from 'react';
import {
  Form, Input,
} from 'antd';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';
import TextAttribute, { TextOptions } from './TextAttribute';

async function validate(rule:any, input:any) {
  // Alleen nederlandse nummers tot nu toe.
  if (input.substring(0, 1) !== '+') {
    return Promise.reject(new Error('Het nummer moet starten met +. Internationale nummers zijn verplicht.'));
  }
  const isnum = /^\d+$/.test(input.substring(2));
  if (input.length > 2 && !isnum) {
    return Promise.reject(new Error('Het nummer bevat andere symbolen.'));
  }
  if (input.substring(0, 4) === '+316') {
    if (input.length < 12 && input.length > 6) {
      return Promise.reject(new Error('Het nummer is te kort.'));
    }
    if (input.length >= 13) {
      return Promise.reject(new Error('Het nummer is te lang.'));
    }
  }
  return Promise.resolve();
}

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
        validator: (rule, input) => validate(rule, input),
      }]}
      tooltip={description ?? undefined}
    >
      <Input placeholder={placeholder ?? undefined} style={{ width: '80%', marginRight: 8 }} />
    </Form.Item>
  );
  return Base;
}

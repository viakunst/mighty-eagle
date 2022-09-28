import React from 'react';
import {
  Form, Input,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';

const { TextArea } = Input;

export interface TextOptions {
  required: boolean,
  placeholder: string,
  rows : number,
}

export default function TextAreaAttribute({
  name,
  attribute,
  description,
  options: {
    required,
    placeholder,
    rows,
  },
}: AttributeConfigData<TextOptions>): AttributeInstance<string> {
  return {
    attribute,
    name,
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
        },
        {
          validator: async (rule, input) => {
            // String only below lenght 2048
            if (input === undefined) return Promise.resolve();
            if (input.length > 2048) return Promise.reject(new Error('Deze tekst is te lang. 2000 character maximaal helaas.'));
            return Promise.resolve();
          },
        }]}
        tooltip={description ?? undefined}
      >
        <TextArea rows={rows ?? 1} placeholder={placeholder ?? undefined} style={{ width: '80%', marginRight: 8 }} />
      </Form.Item>
    ),
    menu: () => ({
      title: name,
      dataIndex: ['userAttributes', attribute],
      key: attribute,
      sorter: (a: any, b: any) => a.userAttributes[attribute]?.localeCompare(b.userAttributes[attribute] ?? '') ?? 0,
      sortDirections: ['ascend', 'descend'],
    }),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value ?? '',
  };
}

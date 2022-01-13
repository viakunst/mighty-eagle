import React from 'react';
import {
  Form, Input,
} from 'antd';
import { UserAttributes } from '../adapters/users/UserAdapter';

export default function TextAttribute({ Name, Attribute, Description }: any) {
  return {
    attribute: Attribute,
    errorMessage: '',
    view: (userData: UserAttributes) => ({
      title: Name,
      key: Name,
      value: userData[Attribute],
    }),
    edit: (value:string | null) => {
      if (value) {
        return (
          <Form.Item
            label={Name}
            required={false}
            key={Attribute}
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
      }
      return (
        <Form.Item
          label={Name}
          required={false}
          key={Attribute}
          name={`attributes[${Attribute}]`}
          validateTrigger={['onChange', 'onBlur']}
          rules={[{
            required: false,
            whitespace: true,
          }]}
        >
          <Input style={{ width: '60%', marginRight: 8 }} />
        </Form.Item>
      );
    },
    value: (value: any) => value,
    validate: (value: any) => {
      if (value != null) {
        return { succes: true, msg: 'valid' };
      }
      return { succes: false, msg: 'error' };
    },
    getName: () => Name,
    getAttribute: () => Attribute,
    getDescription: () => Description,
  };
}

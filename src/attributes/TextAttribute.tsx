import React from 'react';
import {
  Form, Input,
} from 'antd';
import UserAttributeData from '../config/attributesClass/UserAttributeData';

export default function TextAttribute({ Name, Attribute, Description }: any) {
  return {
    attribute: Attribute,
    errorMessage: '',
    view: (userData: UserAttributeData) => {
      const { userAttributes } = userData;
      return ({
        title: Name,
        key: Name,
        value: userAttributes[Attribute],
      });
    },
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

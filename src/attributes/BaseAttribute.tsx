import React from 'react';
import {
  Form, Input,
} from 'antd';
import UserAttributeData from '../attributesClass/UserAttributeData';

export default function BaseAttribute({
  Name, Attribute, Description, Required, Placeholder,
}: any) {
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
    edit: (value:string | null) => (
      <Form.Item
        label={Name}
        name={`attributes[${Attribute}]`}
        initialValue={value}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{
          required: Required,
          whitespace: true,
        }]}
      >
        <Input style={{ width: '60%', marginRight: 8 }} />
      </Form.Item>
    ),
    value: (value: any) => value,
    getName: () => Name,
    getAttribute: () => Attribute,
    getDescription: () => Description,
    getPlaceholder: () => Placeholder,
    getRequired: () => Required,
  };
}

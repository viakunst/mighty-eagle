import React from 'react';
import {
  Form, Input,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../attributesClass/AttributeInstance';
import AttributeConfigData from '../attributesClass/AttributeConfigData';

export default function TextAttribute({
  Name,
  Attribute,
  Description,
}: AttributeConfigData): AttributeInstance<string> {
  return {
    attribute: Attribute,
    view: (userData: UserAttributes) => ({
      title: Name,
      key: Name,
      value: (<>{userData[Attribute]}</>),
    }),
    edit: (value:string | null) => (
      <Form.Item
        label={Name}
        required={false}
        key={Attribute}
        name={`attributes[${Attribute}]`}
        initialValue={value ?? undefined}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{
          required: false,
          whitespace: true,
        }]}
        tooltip={Description ?? undefined}
      >
        <Input style={{ width: '60%', marginRight: 8 }} />
      </Form.Item>
    ),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value,
  };
}

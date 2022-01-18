import React from 'react';
import {
  Form, Input,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../attributesClass/AttributeInstance';
import AttributeConfigData from '../attributesClass/AttributeConfigData';

export default function EmailAttribute({
  Name,
  Attribute,
  Description,
  Required,
  Placeholder,
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
        required={Required || false}
        key={Attribute}
        name={`attributes[${Attribute}]`}
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
        tooltip={Description ?? undefined}
      >
        <Input placeholder={Placeholder ?? undefined} style={{ width: '60%', marginRight: 8 }} />
      </Form.Item>
    ),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value,
  };
}

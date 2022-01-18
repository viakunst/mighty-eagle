import React from 'react';
import {
  Form, Input,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../attributesClass/AttributeInstance';
import AttributeConfigData from '../attributesClass/AttributeConfigData';

function isValidDate(dateString:string):boolean {
  // dd/mm/yyyy pattern.

  // First check for the pattern
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    return false;
  }
  // Parse the date parts to integers
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

export default function DateAttribute({
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
          whitespace: true,
        },
        {
          validator: async (rule, input) => {
            // Alleen nederlandse nummers tot nu toe.
            if (!isValidDate(input)) return Promise.reject(new Error('Datum in dd/mm/yyyy formaat.'));
            return Promise.resolve();
          },
        },
        ]}
        tooltip={Description ?? undefined}
      >
        <Input placeholder={Placeholder ?? undefined} style={{ width: '60%', marginRight: 8 }} />
      </Form.Item>
    ),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value,
  };
}

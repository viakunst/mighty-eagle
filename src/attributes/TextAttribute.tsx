import React from 'react';
import {
  Form, Input,
} from 'antd';

export default function TextAttribute({ Name, Attribute, Description }: any) {
  return {
    attribute: Attribute,
    errorMessage: '',
    view: (userData: any) => {
      const { user } = userData;
      return (
        <tr>
          <th>{Name}</th>
          <td>{user.profile[Attribute]}</td>
        </tr>
      );
    },
    edit: (value:string | null) => {
      if (value) {
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
            <Input style={{ width: '60%', marginRight: 8 }} value={value} />
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

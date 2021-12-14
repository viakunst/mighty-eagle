import React from 'react';
import {
  Form, Checkbox,
} from 'antd';

export default function BooleanAttribute({ Name, Attribute, Description }: any) {
  return {
    attribute: Attribute,
    view: (userData: any) => {
      const { user } = userData;
      return (
        <tr>
          <th>{Name}</th>
          <td>{user.profile[Attribute]}</td>
        </tr>
      );
    },
    edit: (value:boolean | null) => {
      if (value === true) {
        return (
          <Form.Item name={Attribute} valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>{Name}</Checkbox>
          </Form.Item>
        );
      }
      return (
        <Form.Item name={Attribute} valuePropName="unchecked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>{Name}</Checkbox>
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

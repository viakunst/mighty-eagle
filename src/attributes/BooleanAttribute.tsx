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
    edit: (value:string | null) => {
      if (value === 'true') {
        // const eslint:boolean = true;
        return (
          <Form.Item
            label={Name}
            name={`attributes[${Attribute}]`}
            valuePropName="checked"
            key={Attribute}
          >
            <Checkbox />
          </Form.Item>
        );
      }
      return (
        <Form.Item
          label={Name}
          name={`attributes[${Attribute}]`}
          valuePropName="checked"
          key={Attribute}
        >
          <Checkbox />
        </Form.Item>
      );
    },
    value: (value:any) => {
      if (value === true) {
        return 'true';
      }
      return 'false';
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

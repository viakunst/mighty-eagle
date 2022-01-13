import React from 'react';
import {
  Form, Checkbox,
} from 'antd';
import { UserAttributes } from '../adapters/users/UserAdapter';
import AttributeInstance from './AttributeInstance';
import AttributeConfigData from './AttributeConfigData';

export default function BooleanAttribute({
  Name,
  Attribute,
  Description,
}: AttributeConfigData): AttributeInstance<boolean> {
  return {
    attribute: Attribute,
    view: (userData: UserAttributes) => {
      let val;
      if (userData[Attribute] === 'false') {
        val = <Checkbox defaultChecked={false} disabled />;
      } else {
        val = <> <Checkbox defaultChecked disabled /> </>;
      }
      return ({
        title: Name,
        key: Name,
        value: val,
      });
    },
    edit: (value:string | null) => {
      const val = value === 'true';
      return (
        <Form.Item
          label={Name}
          name={`attributes[${Attribute}]`}
          valuePropName="checked"
          initialValue={val}
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

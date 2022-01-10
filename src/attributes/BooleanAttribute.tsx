import React from 'react';
import {
  Form, Checkbox,
} from 'antd';
import UserAttributeData from './attributesClass/UserAttributeData';

export default function BooleanAttribute({ Name, Attribute, Description }: any) {
  return {
    attribute: Attribute,
    view: (userData: UserAttributeData) => {
      const { userAttributes } = userData;
      let val = <> </>;
      if (userAttributes[Attribute] === 'false') {
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
      let val = false;
      if (value === 'true') {
        val = true;
      } else {
        val = false;
      }
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

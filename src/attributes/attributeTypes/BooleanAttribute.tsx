import React from 'react';
import {
  Form, Checkbox,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../attributesClass/AttributeInstance';
import AttributeConfigData from '../attributesClass/AttributeConfigData';

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
    edit: (value:string | null) => (
      <Form.Item
        label={Name}
        name={`attributes[${Attribute}]`}
        valuePropName="checked"
        initialValue={value === 'true'}
        key={Attribute}
        tooltip={Description ?? undefined}
      >
        <Checkbox />
      </Form.Item>
    ),
    parse: (serialized: string) => {
      switch (serialized) {
        case 'true': return true;
        case 'false': return false;
        default: throw new Error();
      }
    },
    serialize: (value: boolean) => {
      if (value === true) {
        return 'true';
      }
      return 'false';
    },
  };
}

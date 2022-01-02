import React, { useContext } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Form,
} from 'antd';
import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

import { userAttributeConfig } from '../../config/attributeConfig';
import UserAttributeData from '../../attributes/UserAttributeData';
import awsManager from '../../services/awsManager';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

interface UserAttributesProps {
  userAttributes: UserAttributeData;
  onAttributesUpdate: () => Promise<void>;
}

export default function ProfileEdit(props:UserAttributesProps) {
  const [form] = Form.useForm();
  const userData = useContext(UserData);
  const { userAttributes, onAttributesUpdate } = props;

  // flush to form.
  const formItems = userAttributeConfig.map(
    (attribute) => {
      if (userAttributes != null) {
        return (attribute.edit(userAttributes.getAttribute(attribute.getAttribute())));
      }
      return null;
    },
  );

  const onFinish = async () => {
    const updatedUserAttributes: AttributeType[] = [];
    userAttributeConfig.forEach((at) => {
      updatedUserAttributes.push({
        Name: at.getAttribute(),
        Value: at.value(form.getFieldValue(`attributes[${at.getAttribute()}]`)),
      });
    });

    await awsManager.update(userData, updatedUserAttributes);
    onAttributesUpdate();
  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Form
        labelCol={formItemLayout?.labelCol}
        wrapperCol={formItemLayout?.wrapperCol}
        form={form}
        onFinish={onFinish}
      >
        {formItems}
        <Form.Item wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        }}
        >
          <Button type="primary" htmlType="submit">Update</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

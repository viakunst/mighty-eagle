import React, { useContext } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Form,
} from 'antd';
import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

import '../style/Profile.css';
import { userAttributeConfig } from '../config/attributeConfig';
import awsManager from '../services/awsManager';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export default function ProfileEdit() {
  const [form] = Form.useForm();

  const userData = useContext(UserData);
  const { user } = userData;

  // Render all attributes
  const formItems = userAttributeConfig.map(
    (attribute) => {
      if (user != null) {
        console.log(user.profile[attribute.getAttribute()]);
        return (attribute.edit(user.profile[attribute.getAttribute()]));
      }
      return null;
    },
  );
  console.log(formItems);

  const onFinish = async () => {
    const userAttributes: AttributeType[] = [];

    console.log(form.getFieldsValue());
    userAttributeConfig.forEach((at) => {
      userAttributes.push({
        Name: at.getAttribute(),
        Value: at.value(form.getFieldValue(`attributes[${at.getAttribute()}]`)),
      });
    });
    console.log(userAttributes);
    awsManager.update(userData, userAttributes);
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

import React from 'react';

import {
  Button, Form, message,
} from 'antd';

import { AdminUpdateUserAttributesCommand, UserType } from '@aws-sdk/client-cognito-identity-provider';
import UserAttributeData from '../../attributesClass/UserAttributeData';
import { adminCreateUserAttributeConfig, adminUpdateUserAttributeConfig } from '../../config/attributeConfig';
import Cognito from '../../services/cognito';

interface AdminUpdateProps {
  userPoolId: string | null;
  user: UserType | null;
  onAttributesUpdate: () => Promise<void>;
}

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

const AdminUpdateForm = (props:AdminUpdateProps) => {
  const [form] = Form.useForm();

  const {
    userPoolId, user, onAttributesUpdate,
  } = props;

  const attributes = new UserAttributeData(user?.Attributes);

  const onFinish = async () => {
    const userAttributes = adminCreateUserAttributeConfig.getAWSAttributes(form);
    console.log(userAttributes);
    try {
      await Cognito.client().send(new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId ?? undefined,
        Username: user?.Username ?? '',
        UserAttributes: userAttributes,
      }));
      message.info('Account succesvol bijgewerkt.');
      onAttributesUpdate();
    } catch (e) {
      message.info('Probleem met het bijwerken van dit account.');
    }
  };

  const formItems = adminUpdateUserAttributeConfig.getFormItems(attributes);
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Form
        labelCol={formItemLayout?.labelCol}
        wrapperCol={formItemLayout?.wrapperCol}
        form={form}
        onFinish={onFinish}
        initialValues={{ userAttr: user?.Attributes }}
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
};

export default AdminUpdateForm;

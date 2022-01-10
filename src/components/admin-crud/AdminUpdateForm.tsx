import React from 'react';

import {
  Button, Form, message,
} from 'antd';

import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import UserAttributeData from '../../attributes/attributesClass/UserAttributeData';
import { adminCreateUserAttributeConfig, adminUpdateUserAttributeConfig } from '../../config/attributeConfig';
import Cognito from '../../adapters/users/CognitoUserAdapter';

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
    if (await Cognito.UpdateUser(userAttributes, user, userPoolId)) {
      message.info('Account succesvol bijgewerkt.');
      onAttributesUpdate();
    } else {
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

import React from 'react';

import {
  Button, Form, message,
} from 'antd';

import { AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { adminCreateUserAttributeConfig } from '../../config/attributeConfig';
import Cognito from '../../services/cognito';

interface AdminCreateProps {
  userPoolId: string | null;
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

const AdminCreateForm = (props:AdminCreateProps) => {
  const [form] = Form.useForm();

  const {
    userPoolId, onAttributesUpdate,
  } = props;

  const onFinish = async () => {
    // Push attributes, that are actually editable, to list.
    const createUserAttributes = adminCreateUserAttributeConfig.getAWSAttributes(form);
    // Email is the hardcoded username.
    const username = form.getFieldValue('attributes[email]');
    try {
      await Cognito.client().send(new AdminCreateUserCommand({
        DesiredDeliveryMediums: ['EMAIL'],
        MessageAction: 'SUPPRESS',
        TemporaryPassword: 'Password@111222',
        UserAttributes: createUserAttributes,
        Username: username,
        UserPoolId: userPoolId ?? undefined,
      }));
      message.info('Account succesvol aangemaakt.');
      onAttributesUpdate();
    } catch (e) {
      message.info(`Probleem met het aanmaken van dit account. \n ${e}`);
    }
  };

  const formItems = adminCreateUserAttributeConfig.getFormItems(null);

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
          <Button type="primary" htmlType="submit">Create</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminCreateForm;

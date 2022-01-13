import React from 'react';

import {
  Button, Form, message,
} from 'antd';

import { adminCreateUserAttributeConfig } from '../../config/attributeConfig';
import UserAdapter from '../../adapters/users/UserAdapter';

interface AdminCreateProps {
  userPool: UserAdapter;
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
    userPool, onAttributesUpdate,
  } = props;

  const onFinish = async () => {
    // Push attributes, that are actually editable, to list.
    const createUserAttributes = adminCreateUserAttributeConfig.getAWSAttributes(form);
    // Email is the hardcoded username.
    const username = form.getFieldValue('attributes[email]');
    try {
      await userPool.createUser(username, createUserAttributes);
      message.info('Account succesvol aangemaakt.');
      onAttributesUpdate();
    } catch {
      message.info('Probleem met het aanmaken van dit account.');
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

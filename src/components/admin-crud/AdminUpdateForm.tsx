import React from 'react';

import {
  Button, Form, message,
} from 'antd';

import { adminCreateUserAttributeConfig, adminUpdateUserAttributeConfig } from '../../config/attributeConfig';
import UserAdapter, { User } from '../../adapters/users/UserAdapter';

interface AdminUpdateProps {
  userPool: UserAdapter;
  user: User;
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
    userPool, user, onAttributesUpdate,
  } = props;

  const onFinish = async () => {
    const userAttributes = adminCreateUserAttributeConfig.getAWSAttributes(form);
    try {
      await userPool.updateUser(user.username, userAttributes);
      message.info('Account succesvol bijgewerkt.');
      onAttributesUpdate();
    } catch {
      message.info('Probleem met het bijwerken van dit account.');
    }
  };

  const formItems = adminUpdateUserAttributeConfig.getFormItems(user.userAttributes);
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Form
        labelCol={formItemLayout?.labelCol}
        wrapperCol={formItemLayout?.wrapperCol}
        form={form}
        onFinish={onFinish}
        initialValues={{ userAttr: user.userAttributes }}
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

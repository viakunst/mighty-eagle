import React from 'react';

import {
  Button, Form, message, Checkbox,
} from 'antd';

import { AdminDeleteUserCommand, UserType } from '@aws-sdk/client-cognito-identity-provider';
import Cognito from '../../services/cognito';

interface AdminDeleteProps {
  userPoolId: string | null;
  user: UserType | null;
  onAttributesUpdate: () => Promise<void>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
};

const AdminDeleteForm = (props:AdminDeleteProps) => {
  const [form] = Form.useForm();

  const {
    userPoolId, user, onAttributesUpdate,
  } = props;

  const onFinish = async () => {
    const check = form.getFieldValue('sure');
    if (check === true) {
      try {
        await Cognito.client().send(new AdminDeleteUserCommand({
          UserPoolId: userPoolId ?? undefined,
          Username: user?.Username ?? '',
        }));
        message.info('Account succesvol verwijdert.');
        onAttributesUpdate();
      } catch (e) {
        message.info('Problem met verwijderen van dit account.');
        console.log(e);
      }
    }
  };

  const formItems = (
    <>
      <Form.Item name="sure" valuePropName="checked" noStyle>
        <Checkbox>Ja, ik wil dit account echt verwijderen.</Checkbox>
      </Form.Item>
    </>
  );

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      Pas op dit is permanent.
      <Form
        labelCol={formItemLayout?.labelCol}
        wrapperCol={formItemLayout?.wrapperCol}
        form={form}
        onFinish={onFinish}
        initialValues={{ sure: false }}
      >
        {formItems}
        <Button type="primary" htmlType="submit">Verwijder account.</Button>
      </Form>
    </div>
  );
};

export default AdminDeleteForm;

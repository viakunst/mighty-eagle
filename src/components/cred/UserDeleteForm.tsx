import React from 'react';

import {
  Button, Form, message, Checkbox,
} from 'antd';

import { AdminDeleteUserCommand, AttributeType, UserType } from '@aws-sdk/client-cognito-identity-provider';
import Cognito from '../../services/cognito';

interface UserAttributesProps {
  userPoolId: string | null;
  user: UserType | null;
  onAttributesUpdate: () => Promise<void>;
}

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

const UserDeleteForm = (props:UserAttributesProps) => {
  const [form] = Form.useForm();

  const {
    userPoolId, user, onAttributesUpdate,
  } = props;

  console.log(user);
  let attributes:AttributeType[] = [];
  if (user && user.Attributes) {
    console.log('doe t');
    console.log(user.Attributes);
    attributes = user.Attributes;
  }

  const onFinish = async () => {
    console.log(form.getFieldValue('sure'));
    const check = form.getFieldValue('sure');
    if (check === 'test') {
      try {
        await Cognito.client().send(new AdminDeleteUserCommand({
          UserPoolId: userPoolId ?? undefined,
          Username: user?.Username ?? '',
        }));
        message.info('UserAttributes is successfully updated!');
        onAttributesUpdate();
      } catch (e) {
        message.info("Can't update user!");
        console.log(e);
      }
    }
  };

  console.log(attributes);

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

export default UserDeleteForm;

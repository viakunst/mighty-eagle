import React from 'react';

import {
  Button, Divider, Form, message,
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

const UserDelete = (props:UserAttributesProps) => {
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

  const onFinish = () => {
    const userAttributes: AttributeType[] = [];
    const formData = form.getFieldsValue();
    console.log(formData);
    console.log(form.getFieldValue(['attributes', 'email']));
    console.log(form.getFieldValue('attributes[email]'));

    console.log(userAttributes);

    Cognito.client().send(new AdminDeleteUserCommand({
      UserPoolId: userPoolId ?? undefined,
      Username: user?.Username ?? '',
    }))
      .then(() => {
        message.info('UserAttributes is successfully updated!');
        onAttributesUpdate();
      })
      .catch((e) => {
        message.info("Can't update user!");
        console.log(e);
      });
  };

  console.log(attributes);

  const formItems = (
    <></>
  );

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <h2>Update User Attributes</h2>
      <Divider />
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

export default UserDelete;

import React from 'react';

import {
  Button, Form, Input, message,
} from 'antd';

import { AdminCreateUserCommand, AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import Cognito from '../../services/cognito';
import { cognitoAttributes } from '../../config/helpers';

interface UserAttributesProps {
  userPoolId: string | null;
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

const UserCreateForm = (props:UserAttributesProps) => {
  const [form] = Form.useForm();

  const {
    userPoolId, onAttributesUpdate,
  } = props;

  const onFinish = () => {
    const userAttributes: AttributeType[] = [];
    const formData = form.getFieldsValue();
    console.log(formData);
    console.log(form.getFieldValue(['attributes', 'email']));
    console.log(form.getFieldValue('attributes[email]'));

    cognitoAttributes.forEach((attribute1) => {
      if (attribute1.Name) {
        const attribute:AttributeType = {
          Name: attribute1.Name,
          Value: form.getFieldValue(`attributes[${attribute1.Name}]`),
        };
        console.log(attribute);
        userAttributes.push(attribute);
      }
    });

    console.log(userAttributes);
    const username = `user-${form.getFieldValue('attributes[email]')}`;
    Cognito.client().send(new AdminCreateUserCommand({
      DesiredDeliveryMediums: ['email'],
      MessageAction: 'RESEND',
      TemporaryPassword: 'pass',
      UserAttributes: userAttributes,
      Username: username,
      UserPoolId: userPoolId ?? undefined,
    })).then(() => {
      message.info('User is successfully created!');
      onAttributesUpdate();
    })
      .catch((e) => {
        message.info("Can't create user!");
        console.log(e);
      });
  };

  const formItems = cognitoAttributes.map((field:any) => (
    <Form.Item
      label={field.Name}
      required={false}
      key={field.Name}
      name={`attributes[${field.Name}]`}
      initialValue={field.Name}
      validateTrigger={['onChange', 'onBlur']}
      rules={[{
        required: false,
        whitespace: true,
      }]}
    >
      <Input style={{ width: '60%', marginRight: 8 }} />
    </Form.Item>
  ));

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

export default UserCreateForm;

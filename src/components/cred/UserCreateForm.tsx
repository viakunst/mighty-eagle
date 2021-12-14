import React from 'react';

import {
  Button, Form, message,
} from 'antd';

import { AdminCreateUserCommand, AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { createUserAttributeConfig } from '../../config/attributeConfig';
import Cognito from '../../services/cognito';

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

  const onFinish = async () => {
    const userAttributes: AttributeType[] = [];
    const formData = form.getFieldsValue();
    console.log(formData);
    console.log(form.getFieldValue(['attributes', 'email']));
    console.log(form.getFieldValue('attributes[email]'));

    // Push attributes that are actually editable.
    createUserAttributeConfig.forEach((at) => {
      const attribute:AttributeType = {
        Name: at.getAttribute(),
        Value: form.getFieldValue(`attributes[${at.attribute}]`),
      };
      console.log(attribute);
      userAttributes.push(attribute);
    });

    // Push attributes with fixed values.

    console.log(userAttributes);
    const username = form.getFieldValue('attributes[email]');
    console.log(username);

    try {
      await Cognito.client().send(new AdminCreateUserCommand({
        DesiredDeliveryMediums: ['EMAIL'],
        MessageAction: 'SUPPRESS',
        TemporaryPassword: 'Password@111222',
        UserAttributes: userAttributes,
        Username: username,
        UserPoolId: userPoolId ?? undefined,
      }));
      message.info('UserAttributes is successfully updated!');
      onAttributesUpdate();
    } catch (e) {
      message.info("Can't update user!");
      console.log(e);
    }
  };

  const formItems = createUserAttributeConfig.map(
    (attribute) => (attribute.edit(null)),
  );

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

import React from 'react';

import {
  Button, Divider, Form, Input, message,
} from 'antd';

import uniqby from 'lodash/uniqBy';

import { AdminCreateUserCommand, AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoAttributes } from '../../config/helpers';
import Cognito from '../../services/cognito';

interface UserAttributesProps {
  userPoolId: string | null;
  attributes: AttributeType[];
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
    userPoolId, attributes, onAttributesUpdate,
  } = props;

  const combined = uniqby([...attributes, ...cognitoAttributes], 'Name');

  const onFinish = () => {
    const userAttributes: AttributeType[] = [];
    const formData = form.getFieldsValue();
    console.log(formData);
    console.log(form.getFieldValue(['attributes', 'email']));
    console.log(form.getFieldValue('attributes[email]'));

    attributes.forEach((at) => {
      if (at.Name) {
        const attribute = {
          Name: at.Name,
          Value: form.getFieldValue(`attributes[${at.Name}]`),
        };
        console.log(attribute);
        if (at.Name === 'sub' || at.Name === 'updated_at') {
          // command
        } else {
          userAttributes.push(attribute);
        }
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

  console.log(attributes);

  const formItems = combined.map((attribute:any) => {
    if (attribute.Name === 'sub') {
      return (<></>);
    }
    return (
      <Form.Item
        label={attribute.Name}
        required={false}
        key={attribute.Name}
        name={`attributes[${attribute.Name}]`}
        initialValue={attribute.Value}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{
          required: false,
          whitespace: true,
        }]}
      >
        <Input style={{ width: '60%', marginRight: 8 }} />
      </Form.Item>
    );
  });

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <h2>Create User</h2>
      <Divider />
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

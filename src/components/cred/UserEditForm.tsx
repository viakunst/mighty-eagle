import React from 'react';

import {
  Button, Form, Input, message,
} from 'antd';

import uniqby from 'lodash/uniqBy';

import { AdminUpdateUserAttributesCommand, AttributeType, UserType } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoAttributes } from '../../config/helpers';
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

const UserEditForm = (props:UserAttributesProps) => {
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

  const combined = uniqby([...attributes, ...cognitoAttributes], 'Name');

  const onFinish = async () => {
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
    try {
      await Cognito.client().send(new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId ?? undefined,
        Username: user?.Username ?? '',
        UserAttributes: userAttributes,
      }));
      message.info('UserAttributes is successfully updated!');
      onAttributesUpdate();
    } catch (e) {
      message.info("Can't update user!");
      console.log(e);
    }
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
  console.log(formItems);

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

export default UserEditForm;

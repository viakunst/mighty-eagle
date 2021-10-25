import React, { Component } from 'react';

import {
  Button, Divider, Form, Input, message,
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

export default class UserAttributes extends Component<UserAttributesProps> {
  handleFinish = (values: any) => {
    const {
      userPoolId, user, onAttributesUpdate,
    } = this.props;
    let userAttributes: AttributeType[] = [];
    const { attributes } = values;
    Object.keys(attributes).forEach((key) => {
      const attribute = {
        Name: key,
        Value: attributes[key],
      };
      userAttributes = userAttributes.concat(attribute);
    });

    Cognito.client().send(new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId ?? undefined,
      Username: user?.Username ?? '',
      UserAttributes: userAttributes,
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

  render() {
    const { user } = this.props;
    const [form] = Form.useForm();
    const attributes = form.getFieldValue('userAttr');
    const combined = uniqby([...attributes, ...cognitoAttributes], 'Name');
    const formItems = combined.map((attribute:any) => {
      if (attribute.Name === 'sub' || attribute.Name === 'email_verified' || attribute.Name === 'email') {
        return (<></>);
      }
      return (
        <Form.Item
          labelCol={{
            xs: { span: 24 },
            sm: { span: 4 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 20 },
          }}
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
        <h2>Update User Attributes</h2>
        <Divider />
        <Form
          form={form}
          onFinish={this.handleFinish}
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
  }
}

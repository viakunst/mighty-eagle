import React, { useContext } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Form,
} from 'antd';

import { userAttributeConfig } from '../../config/attributeConfig';
import OidcService from '../../helpers/OidcService';
import ProfileAdapter from '../../adapters/profile/ProfileAdapter';
import { UserAttributes } from '../../adapters/users/UserAdapter';

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

interface UserAttributesProps {
  profile: ProfileAdapter;
  userAttributes: UserAttributes;
  onAttributesUpdate: () => Promise<void>;
}

export default function ProfileEdit(props:UserAttributesProps) {
  const [form] = Form.useForm();
  const userData = useContext(UserData);
  const { userAttributes, onAttributesUpdate } = props;

  // flush to form.
  const formItems = userAttributeConfig.getFormItems(userAttributes);

  const onFinish = async () => {
    const updatedUserAttributes = userAttributeConfig.getAWSAttributes(form);
    const accessToken = userData.user?.access_token ?? OidcService.throwOnMissingAuth();
    await props.profile.updateUser(accessToken, updatedUserAttributes);
    onAttributesUpdate();
  };

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
          <Button type="primary" htmlType="submit">Update</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

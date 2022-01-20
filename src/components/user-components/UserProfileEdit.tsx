import React, { useContext, useState, useEffect } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Form,
} from 'antd';

import attributeConfig from '../../config/attributeConfig';
import OidcService from '../../helpers/OidcService';
import ProfileAdapter from '../../adapters/profile/ProfileAdapter';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeConfig from '../../attributes/AttributeConfig';
import AttributeConfigParser from '../../attributes/AttributeConfigParser';
import { ConfigContext } from '../../attributes/AttributeConfigData';

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
  const [configInst, setConfigInst] = useState(new AttributeConfig([]));

  // componentDidMount
  useEffect(() => {
    AttributeConfigParser.resolve(attributeConfig, ConfigContext.USER_MUTATE).then((config) => {
      setConfigInst(new AttributeConfig(config));
    });
  }, []);

  // flush to form.
  const formItems = configInst.getFormItems(userAttributes);

  const onFinish = async () => {
    const updatedUserAttributes = configInst.getAWSAttributes(form);
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

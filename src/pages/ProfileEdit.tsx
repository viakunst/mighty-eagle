import React, { useContext } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Form,
} from 'antd';

import '../style/Profile.css';
import { userAttributeConfig } from '../config/attributeConfig';

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

export default function ProfileEdit() {
  const [form] = Form.useForm();

  const userData = useContext(UserData);
  // Render all attributes
  const rows: any[] = [];
  const initial: any[] = [];
  const formItems = userAttributeConfig.forEach(
    (attribute) => {
      rows.push(attribute.edit(null));
      initial.push(attribute.view(userData));
    },
  );

  const onFinish = async () => {

  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Form
        labelCol={formItemLayout?.labelCol}
        wrapperCol={formItemLayout?.wrapperCol}
        form={form}
        onFinish={onFinish}
        initialValues={{ userAttr: initial }}
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

import React from 'react';

import {
  Table,
} from 'antd';

import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import { adminReadUserAttributeConfig } from '../../config/attributeConfig';
import UserAttributeData from '../../attributesClass/UserAttributeData';

interface AdminReadProps {
  user: UserType | null;
}

// Class handles view, edit, and delete.
const AdminReadForm = (props:AdminReadProps) => {
  const {
    user,
  } = props;

  const attributes = new UserAttributeData(user?.Attributes);

  const columns = [
    {
      title: 'Veld',
      dataIndex: 'key',
      key: 'name',
    },
    {
      title: 'Waarde',
      dataIndex: 'value',
      key: 'age',
    },
  ];
  const columnData:any[] = adminReadUserAttributeConfig.getColumnItems(attributes);

  // Add delete, edit, cancel button.
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Table dataSource={columnData} columns={columns} />
    </div>
  );
};

export default AdminReadForm;

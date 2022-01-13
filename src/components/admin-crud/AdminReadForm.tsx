import React from 'react';

import {
  Table,
} from 'antd';

import { adminReadUserAttributeConfig } from '../../config/attributeConfig';
import { User } from '../../adapters/users/UserAdapter';

interface AdminReadProps {
  user: User;
}

// Class handles view, edit, and delete.
const AdminReadForm = (props:AdminReadProps) => {
  const {
    user,
  } = props;

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
  const columnData:any[] = adminReadUserAttributeConfig.getColumnItems(user.userAttributes);

  // Add delete, edit, cancel button.
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Table dataSource={columnData} columns={columns} />
    </div>
  );
};

export default AdminReadForm;

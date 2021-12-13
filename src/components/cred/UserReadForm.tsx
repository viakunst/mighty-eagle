import React from 'react';

import {
  Table,
} from 'antd';

import { AttributeType, UserType } from '@aws-sdk/client-cognito-identity-provider';

interface UserAttributesProps {
  user: UserType | null;
}

// Class handles view, edit, and delete.
const UserReadForm = (props:UserAttributesProps) => {
  const {
    user,
  } = props;

  console.log(user);
  let attributes:AttributeType[] = [];
  if (user && user.Attributes) {
    console.log('doe t');
    console.log(user.Attributes);
    attributes = user.Attributes;
  }

  console.log(attributes);

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

  const columnData:any[] = [];
  attributes.forEach((att) => {
    columnData.push({
      title: att.Name,
      key: att.Name,
      value: att.Value,
    });
  });

  // Add delete, edit, cancel button.
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Table dataSource={columnData} columns={columns} />
    </div>
  );
};

export default UserReadForm;

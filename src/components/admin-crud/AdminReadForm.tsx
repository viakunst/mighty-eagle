import React, { useEffect, useState } from 'react';

import {
  Table,
} from 'antd';

import attributeConfig from '../../config/attributeConfig';
import { User } from '../../adapters/users/UserAdapter';
import AttributeConfig from '../../attributes/AttributeConfig';
import AttributeConfigParser from '../../attributes/AttributeConfigParser';
import { ConfigContext } from '../../attributes/AttributeConfigData';

interface AdminReadProps {
  user: User;
}

// Class handles view, edit, and delete.
const AdminReadForm = (props:AdminReadProps) => {
  const {
    user,
  } = props;
  const [configInst, setConfigInst] = useState(new AttributeConfig([]));

  // componentDidMount
  useEffect(() => {
    AttributeConfigParser.resolve(attributeConfig, ConfigContext.ADMIN_READ).then((config) => {
      setConfigInst(new AttributeConfig(config));
    });
  }, []);

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
  const columnData:any[] = configInst.getColumnItems(user.userAttributes);

  // Add delete, edit, cancel button.
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Table dataSource={columnData} columns={columns} />
    </div>
  );
};

export default AdminReadForm;

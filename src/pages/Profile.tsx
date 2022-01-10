import React, { useContext, useState, useEffect } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Modal, Table,
} from 'antd';
import '../style/Profile.css';
import ProfileEdit from '../components/user-components/UserProfileEdit';
import { userAttributeConfig } from '../config/attributeConfig';
import AdminMenu from '../components/admin-components/AdminMenu';
import SignOutButton from '../components/user-components/SignOutButton';
import UserAttributeData from '../attributes/attributesClass/UserAttributeData';
import UserProfile from '../adapters/profile/CognitoProfileAdapter';

export default function Profile() {
  const userData = useContext(UserData);
  const [visible, setVisible] = useState(false);
  const intialUserAttributeData:UserAttributeData = new UserAttributeData();
  const [userAttributes, setAttributes] = useState(intialUserAttributeData);

  const closeModal = () => {
    setVisible(false);
  };

  const fetchUserData = async () => UserProfile.GetUser(userData);

  const onAttributesUpdate = async () => {
    const userAttributes1 = await fetchUserData();
    if (userAttributes1) {
      setAttributes(new UserAttributeData(userAttributes1));
    }
    closeModal();
  };

  const parseUser = async () => {
    const currentUserAttributes = await fetchUserData();
    if (currentUserAttributes) {
      setAttributes(new UserAttributeData(currentUserAttributes));
    }
  };

  // This is a onmount effect.
  useEffect(() => { parseUser(); }, []);

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
  const columnData:any[] = userAttributeConfig.getColumnItems(userAttributes);

  return (
    <div className="profile card row">
      <h2>Jouw profiel</h2>
      <div>
        <Table pagination={false} dataSource={columnData} columns={columns} />
      </div>
      <br />
      <Modal
        title="Gegevens bewerken"
        destroyOnClose
        visible={visible}
        onCancel={closeModal}
        footer={null}
      >
        <ProfileEdit
          userAttributes={userAttributes}
          onAttributesUpdate={onAttributesUpdate}
        />
      </Modal>
      <AdminMenu />
      <Button type="primary" onClick={() => setVisible(true)}>
        Gegevens bewerken
      </Button>
      <SignOutButton />
    </div>
  );
}

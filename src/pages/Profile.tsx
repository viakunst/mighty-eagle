import React, { useContext, useState, useEffect } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Modal, Table,
} from 'antd';
import '../style/Profile.css';
import CognitoProfileAdapter from '../adapters/profile/CognitoProfileAdapter';
import ProfileEdit from '../components/user-components/UserProfileEdit';
import { userReadAttributeConfig } from '../config/attributeConfig';
import AdminMenu from '../components/admin-components/AdminMenu';
import SignOutButton from '../components/user-components/SignOutButton';
import OidcService from '../helpers/OidcService';
import { UserAttributes } from '../adapters/users/UserAdapter';

export default function Profile() {
  const userData = useContext(UserData);
  const [visible, setVisible] = useState(false);
  const intialUserAttributeData: UserAttributes = {};
  const [userAttributes, setAttributes] = useState(intialUserAttributeData);
  const profile = new CognitoProfileAdapter();

  const closeModal = () => {
    setVisible(false);
  };

  const fetchUserData = async () => {
    const accessToken = userData.user?.access_token ?? OidcService.throwOnMissingAuth();
    return profile.getUser(accessToken);
  };

  const onAttributesUpdate = async () => {
    const user = await fetchUserData();
    if (user) {
      setAttributes(user.userAttributes);
    }
    closeModal();
  };

  const parseUser = async () => {
    const currentUser = await fetchUserData();
    if (currentUser) {
      setAttributes(currentUser.userAttributes);
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

  const columnData:any[] = userReadAttributeConfig.getColumnItems(userAttributes);

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
          profile={profile}
          userAttributes={userAttributes}
          onAttributesUpdate={onAttributesUpdate}
        />
      </Modal>
      <AdminMenu profile={profile} />
      <Button type="primary" onClick={() => setVisible(true)}>
        Gegevens bewerken
      </Button>
      <SignOutButton />
    </div>
  );
}

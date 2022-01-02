import React, { useContext, useState, useEffect } from 'react';
import { UserData } from 'react-oidc';
import {
  Button, Modal, Table,
} from 'antd';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import '../style/Profile.css';
import ProfileEdit from '../components/cred/ProfileEdit';
import { userAttributeConfig } from '../config/attributeConfig';
import AdminMenu from '../components/admin-button/AdminMenu';
import SignOutButton from '../components/admin-button/SignOutButton';
import UserAttributeData from '../attributes/UserAttributeData';
import Cognito from '../services/cognito';

export default function Profile() {
  const userData = useContext(UserData);
  const [visible, setVisible] = useState(false);
  const intialUserAttributeData:UserAttributeData = new UserAttributeData();
  const [userAttributes, setAttributes] = useState(intialUserAttributeData);

  const closeModal = () => {
    setVisible(false);
  };

  const fetchUserData = async () => {
    const response = await Cognito.client().send(new GetUserCommand({
      AccessToken: userData.user?.access_token,
    }));
    return response.UserAttributes;
  };

  const onAttributesUpdate = async () => {
    const userAttributes1 = await fetchUserData();
    if (userAttributes1) {
      const updatedUserAttributeData:UserAttributeData = new UserAttributeData();
      updatedUserAttributeData.parseAWS(userAttributes1);
      setAttributes(updatedUserAttributeData);
    }
    closeModal();
  };

  const parseUser = async () => {
    const currentUserAttributes = await fetchUserData();
    if (currentUserAttributes) {
      const updatedUserAttributeData:UserAttributeData = new UserAttributeData();
      updatedUserAttributeData.parseAWS(currentUserAttributes);
      setAttributes(updatedUserAttributeData);
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

  const columnData:any[] = [];

  userAttributeConfig.forEach((att) => {
    columnData.push(att.view(userAttributes));
  });

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

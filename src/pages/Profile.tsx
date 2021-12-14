import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserData } from 'react-oidc';
import {
  Button, Modal,
} from 'antd';
import '../style/Profile.css';
import ProfileEdit from '../components/ProfileEdit';
import { userAttributeConfig } from '../config/attributeConfig';
import AdminMenu from '../components/admin-button/AdminMenu';
import SignOutButton from '../components/admin-button/SignOutButton';

export default function Profile() {
  const userData = useContext(UserData);
  const [visible, setVisible] = useState(false);

  // Render all attributes
  const rows:any = [];

  userAttributeConfig.forEach(
    (attribute) => rows.push(attribute.view(userData)),
  );
  console.log(rows);

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <div className="profile card row">
      <h2>Jouw profiel</h2>
      <div className="table">
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <br />
      <Modal
        title="Gegevens bewerken"
        destroyOnClose
        visible={visible}
        onCancel={closeModal}
        footer={null}
      >
        <ProfileEdit />
      </Modal>
      <AdminMenu />
      <Button type="primary" onClick={() => setVisible(true)}>
        Gegevens bewerken
      </Button>
      <Link to="/edit">
        <Button>
          d
        </Button>
      </Link> |{' '}
      <SignOutButton />
    </div>
  );
}

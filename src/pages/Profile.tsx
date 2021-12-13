import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserData } from 'react-oidc';
import {
  Button,
} from 'antd';
import '../style/Profile.css';
import attributeConfig from '../config/attributeConfig';
import AdminMenu from '../components/admin-button/AdminMenu';
import SignOutButton from '../components/admin-button/SignOutButton';

export default function Profile() {
  const userData = useContext(UserData);

  // Render all attributes
  const rows:any = [];

  attributeConfig.forEach(
    (attribute) => rows.push(attribute.view(userData)),
  );

  return (
    <div className="profile card row">
      <h2>Jouw profiel</h2>
      <div className="table">
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <br />
      <AdminMenu />
      <Link to="/edit">
        <Button>
          Gegevens bewerken
        </Button>
      </Link> |{' '}
      <SignOutButton />
    </div>
  );
}

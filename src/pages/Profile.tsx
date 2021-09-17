import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserData } from 'react-oidc';
import '../style/Profile.css';
import attributeConfig from '../config/attributeConfig';
import userManager from '../services/userManager';
import AdminMenu from '../components/admin-button/AdminMenu';

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
      <Link to="/edit">Gegevens bewerken</Link> |{' '}
      <button type="button" onClick={() => userManager.signoutRedirect()}>Uitloggen</button>
    </div>
  );
}

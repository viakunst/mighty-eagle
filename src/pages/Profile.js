import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { UserData } from "react-oidc";
import '../style/Profile.css';
import userManager from "../services/userManager";

export default function Profile() {
  const userData = useContext(UserData);

  const generateRow = (text, field) => (
    <tr>
      <th>{ text }</th>
      <td>{ userData?.user.profile[field] }</td>
    </tr>
  );

  return (
    <div className="profile card row">
      <h2>Jouw profiel</h2>
      <div className="table">
        <table>
          <tbody>
            { generateRow('Naam', 'name' ) }
            { generateRow('E-mail', 'email' ) }
          </tbody>
        </table>
      </div>
      <br />
      <Link to="/edit">Gegevens bewerken</Link> | <a href="#" onClick={() => userManager.signoutRedirect()}>Uitloggen</a>
  </div>
  );
}

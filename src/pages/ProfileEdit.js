import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { UserData } from "react-oidc";
import '../style/Profile.css';

export default function ProfileEdit() {
  const userData = useContext(UserData);

  const generateRow = (text, field) => (
    <tr>
      <th>{ text }</th>
      <td>{ userData?.user.profile[field] }</td>
    </tr>
  );

  return (
    <div className="profile card row">
      <h2>Profiel bewerken</h2>
      <div className="table">
        <table>
          <tbody>
            { generateRow('Naam', 'name' ) }
            { generateRow('E-mail', 'email' ) }
          </tbody>
        </table>
      </div>
      <br />
      <Link to="/">Annuleren</Link>
  </div>
  );
}

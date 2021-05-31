import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { UserData } from "react-oidc";
import '../style/Profile.css';
import attributeConfig from '../config/attributeConfig';
import userManager from "../services/userManager";

export default function Profile() {
  const userData = useContext(UserData);
  
  // Render all attributes
  let rows = [];
  for (const { view } of attributeConfig) {
    rows.push(view(userData));
  }

  return (
    <div className="profile card row">
      <h2>Jouw profiel</h2>
      <div className="table">
        <table>
          <tbody>
            { rows }
          </tbody>
        </table>
      </div>
      <br />
      <Link to="/edit">Gegevens bewerken</Link> | <button onClick={() => userManager.signoutRedirect()}>Uitloggen</button>
  </div>
  );
}

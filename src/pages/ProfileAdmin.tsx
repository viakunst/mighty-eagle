import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Profile.css';
import '../style/Admin.css';
import attributeConfig from '../config/attributeConfig';
import { UserPool } from '../components/user-pools/UserPool';

export default function ProfileAdmin() {
  // Render all attributes
  const rows: any[] = [];

  attributeConfig.forEach(
    (attribute) => rows.push(attribute.edit()),
  );

  return (
    <div className="admin card row">
      <h2>Admin beheer paneel</h2>
      <Link to="/">Annuleren</Link>
      <div className="table">
        <UserPool />
      </div>
      <br />
    </div>
  );
}

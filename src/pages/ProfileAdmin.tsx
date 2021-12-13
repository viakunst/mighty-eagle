import React from 'react';
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
      <h2>Ledenlijst</h2>
      <div className="table">
        <UserPool />
      </div>
      <br />
    </div>
  );
}

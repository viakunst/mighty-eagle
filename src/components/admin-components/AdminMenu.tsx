import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import {
  Button,
} from 'antd';

import Cognito from '../../helpers/CognitoService';
import OidcService from '../../helpers/OidcService';
import ProfileAdapter from '../../adapters/profile/ProfileAdapter';

interface AdminMenuProps {
  profile: ProfileAdapter;
}

export default function AdminMenu({ profile }: AdminMenuProps) {
  const [state, setState] = useState({
    admin: 'user',
  });

  // componentDidMount
  useEffect(() => {
    // TO-DO: check if Cognito has his credentials.

    Cognito.signIn(OidcService.getIdToken() ?? undefined).then(async () => {
      const role = await profile.getRole();
      setState({ ...state, admin: role });
    });
  }, []);

  const {
    admin,
  } = state;

  if (admin === 'admin') {
    return (
      <>
        <Link to="/admin">
          <Button>
            Beheer
          </Button>
        </Link> | {' '}
      </>
    );
  }

  return (<></>);
}

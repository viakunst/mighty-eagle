import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import {
  Button,
} from 'antd';

import Cognito from '../../services/cognito';

export default function AdminMenu() {
  const [state, setState] = useState({
    admin: 'user',
  });

  // componentDidMount
  useEffect(() => {
    // TO-DO: check if Cognito has his credentials.

    Cognito.signIn(Cognito.getIdToken()).then(() => Cognito.getRole().then((value) => {
      setState({ ...state, admin: value });
    }).catch((err) => console.log('ERROR', err)));
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

  return (<>no admin</>);
}

import React, { useState } from 'react';
import {
  Button,
} from 'antd';
import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import UserCreateForm from '../cred/UserCreateForm';
import UserReadForm from '../cred/UserReadForm';
import UserEditForm from '../cred/UserEditForm';
import UserDeleteForm from '../cred/UserDeleteForm';

interface UserCRUDProps {
  userPoolId: string | null;
  user: UserType | null;
  onAttributesUpdate: () => Promise<void>;
  modelTitleUpdate: (str:String) => void;
}

const UserCRUD = (props:UserCRUDProps) => {
  const [mode, setMode] = useState('view');
  const {
    user,
  } = props;

  // if user is null, this implies that it is a create component.
  if (user === null && mode !== 'create') {
    console.log('user is null');
    setMode('create');
    props.modelTitleUpdate('Account aanmaken.');
  }

  console.log(props);

  const updateMode = (str:string) => {
    setMode(str);
    switch (str) {
      case 'create':
        props.modelTitleUpdate('Account aanmaken.');
        break;
      case 'view':
        props.modelTitleUpdate('Account bekijken.');
        break;
      case 'edit':
        props.modelTitleUpdate('Account bewerken.');
        break;
      case 'delete':
        props.modelTitleUpdate('Account verwijderen.');
        break;
      default:
        setMode('Fout.');
        break;
    }
  };

  if (mode === 'create') {
    return (
      <>
        <UserCreateForm
          userPoolId={props.userPoolId}
          onAttributesUpdate={props.onAttributesUpdate}
        />
      </>
    );
  }
  if (mode === 'view') {
    return (
      <>
        <Button type="primary" onClick={() => updateMode('edit')}>
          Bewerken
        </Button>
        <Button type="primary" onClick={() => updateMode('delete')}>
          Verwijderen
        </Button>
        <UserReadForm
          user={props.user}
        />
      </>
    );
  }
  if (mode === 'edit') {
    return (
      <>
        <Button type="primary" onClick={() => updateMode('view')}>
          Annuleren
        </Button>
        <UserEditForm
          userPoolId={props.userPoolId}
          user={props.user}
          onAttributesUpdate={props.onAttributesUpdate}
        />
      </>
    );
  }
  if (mode === 'delete') {
    return (
      <>
        <Button type="primary" onClick={() => updateMode('view')}>
          Annuleren
        </Button>
        <UserDeleteForm
          userPoolId={props.userPoolId}
          user={props.user}
          onAttributesUpdate={props.onAttributesUpdate}
        />
      </>
    );
  }
  // Error in component, if this happens
  return (
    <>{mode} Error, mode of user view undefined.</>
  );
};

export default UserCRUD;

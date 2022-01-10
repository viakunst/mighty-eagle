import React, { useState } from 'react';
import {
  Button,
} from 'antd';
import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import UserCreateForm from '../admin-crud/AdminCreateForm';
import UserReadForm from '../admin-crud/AdminReadForm';
import UserEditForm from '../admin-crud/AdminUpdateForm';
import UserDeleteForm from '../admin-crud/AdminDeleteForm';
import Conditional from '../Conditional';

interface UserDetailsProps {
  userPoolId: string | null;
  user: UserType | null;
  onAttributesUpdate: () => Promise<void>;
  modelTitleUpdate: (str: string) => void;
}

export default function UserDetails({
  user, userPoolId, onAttributesUpdate, modelTitleUpdate,
}: UserDetailsProps) {
  const [mode, setMode] = useState('view');

  // if user is null, this implies that it is a create component.
  if (user === null && mode !== 'create') {
    setMode('create');
    modelTitleUpdate('Account aanmaken.');
  }

  const updateMode = (str:string) => {
    setMode(str);
    switch (str) {
      case 'create':
        modelTitleUpdate('Account aanmaken.');
        break;
      case 'edit':
        modelTitleUpdate('Account bewerken.');
        break;
      case 'delete':
        modelTitleUpdate('Account verwijderen.');
        break;
      case 'view':
      default:
        modelTitleUpdate('Account bekijken.');
        break;
    }
  };

  return (
    <>
      <Conditional isVisible={() => mode === 'create'}>
        <UserCreateForm
          userPoolId={userPoolId ?? ''}
          onAttributesUpdate={onAttributesUpdate}
        />
      </Conditional>
      <Conditional isVisible={() => mode === 'view'}>
        <Button type="primary" onClick={() => updateMode('edit')}>
          Bewerken
        </Button>
        <Button type="primary" onClick={() => updateMode('delete')}>
          Verwijderen
        </Button>
        <UserReadForm
          user={user}
        />
      </Conditional>
      <Conditional isVisible={() => mode === 'edit'}>
        <Button type="primary" onClick={() => updateMode('view')}>
          Annuleren
        </Button>
        <UserEditForm
          userPoolId={userPoolId}
          user={user}
          onAttributesUpdate={onAttributesUpdate}
        />
      </Conditional>
      <Conditional isVisible={() => mode === 'delete'}>
        <Button type="primary" onClick={() => updateMode('view')}>
          Annuleren
        </Button>
        <UserDeleteForm
          userPoolId={userPoolId}
          user={user}
          onAttributesUpdate={onAttributesUpdate}
        />
      </Conditional>
    </>
  );
}

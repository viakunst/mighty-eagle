import React, { useState } from 'react';
import {
  Button, message,
} from 'antd';
import UserCreateForm from '../admin-crud/AdminCreateForm';
import UserReadForm from '../admin-crud/AdminReadForm';
import UserEditForm from '../admin-crud/AdminUpdateForm';
import UserDeleteForm from '../admin-crud/AdminDeleteForm';
import Conditional from '../Conditional';
import UserAdapter, { User } from '../../adapters/users/UserAdapter';

interface UserDetailsProps {
  userPool: UserAdapter;
  user: User | null;
  onAttributesUpdate: () => Promise<void>;
  modelTitleUpdate: (str: string) => void;
}

export default function UserDetails({
  user, userPool, onAttributesUpdate, modelTitleUpdate,
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

  const resendInvitation = async () => {
    if (user !== null) {
      try {
        await userPool.resendInvitation(user);
        message.info('Email verstuurt');
        onAttributesUpdate();
      } catch {
        message.info('Probleem met het versturen van de uitnodiging.');
      }
    }
  };

  const resetPassword = async () => {
    if (user !== null) {
      try {
        await userPool.forcePasswordReset(user);
        message.info('Email verstuurt');
        onAttributesUpdate();
      } catch {
        message.info('Probleem met het versturen van de uitnodiging.');
      }
    }
  };

  const invitationButtion = () => {
    if (user?.status === 'CONFIRMED') {
      return (
        <Button type="primary" onClick={() => resetPassword()}>
          Reset wachtwoord
        </Button>
      );
    }
    return (
      <Button type="primary" onClick={() => resendInvitation()}>
        Verstuur uitnodiging
      </Button>
    );
  };

  return (
    <>
      <Conditional isVisible={() => mode === 'create'}>
        <UserCreateForm
          userPool={userPool}
          onAttributesUpdate={onAttributesUpdate}
        />
      </Conditional>
      { user && (
      <>
        <Conditional isVisible={() => mode === 'view'}>
          <Button type="primary" onClick={() => updateMode('edit')}>
            Bewerken
          </Button> | {' '}
          <Button type="primary" onClick={() => updateMode('delete')}>
            Verwijderen
          </Button>
          {invitationButtion()}
          <UserReadForm
            user={user}
          />
        </Conditional>
        <Conditional isVisible={() => mode === 'edit'}>
          <Button type="primary" onClick={() => updateMode('view')}>
            Annuleren
          </Button>
          <UserEditForm
            userPool={userPool}
            user={user}
            onAttributesUpdate={onAttributesUpdate}
          />
        </Conditional>
        <Conditional isVisible={() => mode === 'delete'}>
          <Button type="primary" onClick={() => updateMode('view')}>
            Annuleren
          </Button>
          <UserDeleteForm
            userPool={userPool}
            user={user}
            onAttributesUpdate={onAttributesUpdate}
          />
        </Conditional>
      </>
      )}
    </>
  );
}

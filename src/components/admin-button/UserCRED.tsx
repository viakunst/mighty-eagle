import React, { Component } from 'react';
import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import UserEditForm from '../cred/UserEditForm';

interface UserAttributesProps {
  userPoolId: string | null;
  user: UserType | null;
  onAttributesUpdate: () => Promise<void>;
}

export default class UserCRED extends Component<{}, { mode:string, data:UserAttributesProps }> {
  constructor(props:UserAttributesProps) {
    super(props);
    this.state = {
      mode: 'view',
      data: props,
    };
  }

  async componentDidMount() {
    // TO-DO: check if Cognito has his credentials.
  }

  setMode(newMode:string) {
    this.setState({ mode: newMode });
  }

  render() {
    const {
      mode, data,
    } = this.state;

    if (mode === 'view') {
      return (
        <>
          <UserEditForm
            userPoolId={data.userPoolId}
            user={data.user}
            onAttributesUpdate={data.onAttributesUpdate}
          />
          <button type="button" onClick={() => this.setMode('edit')}>edit</button>
          <button type="button" onClick={() => this.setMode('delete')}>delete</button>
        </>
      );
    }
    if (mode === 'edit') {
      return (
        <>
          <UserEditForm
            userPoolId={data.userPoolId}
            user={data.user}
            onAttributesUpdate={data.onAttributesUpdate}
          />
          <button type="button" onClick={() => this.setMode('view')}>cancel</button>
        </>
      );
    }
    if (mode === 'delete') {
      return (
        <>
          <UserEditForm
            userPoolId={data.userPoolId}
            user={data.user}
            onAttributesUpdate={data.onAttributesUpdate}
          />
          <button type="button" onClick={() => this.setMode('view')}>cancel</button>
        </>
      );
    }
    // Error in component, if this happens
    return (<>Error, mode of user view undefined.</>);
  }
}

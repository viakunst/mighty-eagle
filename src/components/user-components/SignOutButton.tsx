import React from 'react';
import { Button } from 'antd';
import userManagerConfig from '../../config/userManagerConfig';

function SignOutButton() {
  const signOutRedirect = async () => {
    const endpoint = userManagerConfig.metadata.token_endpoint.slice(0, -12).concat('logout');

    const logoutUri = userManagerConfig.post_logout_redirect_uri;
    const clientId = userManagerConfig.client_id;

    const requestUri = `${endpoint}?client_id=${clientId}&logout_uri=${logoutUri}`;
    window.location.assign(requestUri);
  };

  // WARNING: completely clears local storage (of this site).
  // This shouldn't pose a problem since you are already logging out.
  const signOut = () => {
    signOutRedirect();
    localStorage.clear();
  };

  return (
    <> | {' '}
      <Button type="primary" onClick={() => signOut()}>
        Log uit
      </Button>
    </>
  );
}

export default SignOutButton;

import React from 'react';
import userManagerConfig from '../../config/userManagerConfig';

function SignOutButton() {
  const signOutRedirect = async () => {
    // https://vktestdomain.auth.eu-west-2.amazoncognito.com/oauth2/token
    const endpoint = userManagerConfig.metadata.token_endpoint.slice(0, -12).concat('logout');
    console.log(endpoint);

    const logoutUri = userManagerConfig.post_logout_redirect_uri;
    const clientId = userManagerConfig.client_id;

    console.log(logoutUri);
    console.log(clientId);
    const requestUri = `${endpoint}?client_id=${clientId}&logout_uri=${logoutUri}`;
    const serverUri = 'http://localhost:3000';
    console.log(serverUri);
    window.location.assign(requestUri);
  };

  // WARNING: completely clears local storage (of this site).
  // This shouldn't pose a problem since you are already logging out.
  const signOut = () => {
    signOutRedirect();
    localStorage.clear();
  };

  return (
    <button type="button" onClick={() => signOut()}>
      Activate Lasers
    </button>
  );
}

export default SignOutButton;

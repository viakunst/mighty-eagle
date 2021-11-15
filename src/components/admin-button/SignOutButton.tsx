import React, { Component, useContext } from 'react';
import { UserData } from 'react-oidc';
import userManagerConfig from '../../config/userManagerConfig';

class SignOutButton extends Component<{}, {}> {
  static async signOutRedirect() {
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
  }

  static signOut() {
    const userData = useContext(UserData);
    if (userData.userManager !== null) {
      userData.userManager.removeUser();
      SignOutButton.signOutRedirect();
    }
  }

  render() {
    return (
      <button type="button" onClick={() => SignOutButton.signOut()}>
        Activate Lasers
      </button>
    );
  }
}

export default SignOutButton;

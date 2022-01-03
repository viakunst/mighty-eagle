import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeAuthenticator, Callback } from 'react-oidc';
import Cognito from '../services/cognito';
import Profile from '../pages/Profile';
import ProfileAdmin from '../pages/ProfileAdmin';
import Error404 from '../pages/Error404';
import userManager from '../services/userManager';

// Eslint requires this rename, because
// Shorthand expected.
const userManager1 = userManager;
const WithAuth = makeAuthenticator({
  userManager: userManager1,
});

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/callback"
          render={(routeProps) => (
            <Callback
              // sign in succes.
              // Do after sign-in function here.
              onSuccess={(user) => {
                if (user.state != null) {
                  //  placeholder
                }

                console.log('succes');

                // Instantly identify the user in the identity pool and request credentials.
                Cognito.saveIdToken(user.id_token);
                // `user.state` will reflect the state that was passed in via signinArgs.
                routeProps.history.push('/');
              }}
              onError={(error) => {
                console.log(`Authorization failed. ${error}`);
              }}
              userManager={userManager}
            />
          )}
        />
        <Route path="/admin" exact component={WithAuth(ProfileAdmin)} />
        <Route path="/" exact component={WithAuth(Profile)} />
        <Route path="/" component={Error404} />
      </Switch>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeAuthenticator, Callback } from 'react-oidc'
import Profile from "../pages/Profile";
import ProfileEdit from "../pages/ProfileEdit";
import Error404 from "../pages/Error404";
import userManager from "../services/userManager";

const WithAuth = makeAuthenticator({
	userManager: userManager,
});

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/callback"
                    render={routeProps => (
                    <Callback
                        onSuccess={user => {
                            // `user.state` will reflect the state that was passed in via signinArgs.
                            routeProps.history.push('/')
                        }}
                        onError={(error) => {
                            console.log(`Authorization failed. ${error}`);
                        }}
                        userManager={userManager}
                    />
                    )}
                />
                <Route path="/edit" exact component={ WithAuth(ProfileEdit) } />
                <Route path="/" exact component={ WithAuth(Profile) } />
                <Route path="/" component={ Error404 } />
            </Switch>
        </BrowserRouter>
    );
}
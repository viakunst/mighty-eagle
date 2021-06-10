import { WebStorageStateStore, Log } from "oidc-client";

const userManagerConfig = {
  metadata: {
    'issuer': "http://localhost:3000/token",
    'authorization_endpoint': "https://localhost:3000/token",
    'token_endpoint': "http://localhost:4000/token",
    'userinfo_endpoint': "http://localhost:4000/api/userinfo",
    'jwks_uri': "http://localhost:4000/.well-known/jwks.json",
  },
  signinKeys: [],
	authority: 'https://localhost:4000',
  client_id: "profile-test",
  scope: 'openid profile email',
  response_type: 'code',
	userStore: new WebStorageStateStore({ store: window.localStorage }),
	redirect_uri: window.location.origin + '/callback',
  post_logout_redirect_uri: window.location.origin + '/',
};

Log.logger = console;
Log.level = Log.INFO;

export default userManagerConfig;
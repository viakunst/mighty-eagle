import { WebStorageStateStore, Log } from 'oidc-client';

const loc = window.location;

const userManagerConfig = {
  metadata: {
    issuer: 'https://openid.com',
    authorization_endpoint: 'https://openid.com/authorize',
    token_endpoint: 'https://openid.com/token',
    userinfo_endpoint: 'https://openid.com/userInfo',
    jwks_uri: 'https://openid.com/.well-known/jwks.json',
  },
  signinKeys: [],
  authority: 'https://openid.com',
  client_id: 'identity',
  scope: 'openid email profile',
  response_type: 'code',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  redirect_uri: loc.origin.concat('/callback'),
  post_logout_redirect_uri: loc.origin.concat('/'),
};

Log.logger = console;
Log.level = Log.INFO;

export default userManagerConfig;

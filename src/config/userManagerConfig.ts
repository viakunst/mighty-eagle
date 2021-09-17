import { WebStorageStateStore, Log } from 'oidc-client';

const loc = window.location;

const userManagerConfig = {
  metadata: {
    issuer: 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_WQP0NVKyY',
    authorization_endpoint: 'https://vktestdomain.auth.eu-west-2.amazoncognito.com/oauth2/authorize',
    token_endpoint: 'https://vktestdomain.auth.eu-west-2.amazoncognito.com/oauth2/token',
    userinfo_endpoint: 'https://vktestdomain.auth.eu-west-2.amazoncognito.com/oauth2/userInfo',
    jwks_uri: 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_WQP0NVKyY/.well-known/jwks.json',
  },
  signinKeys: [],
  authority: 'https://cognito-idp.eu-west-2.amazonaws.com/Viakunst',
  client_id: '2b7bav07aqq7dj1o43pg8ul9q2',
  client_secret: '1n7439pkelpnmiep005rvsqhoe8vkmq1n4a7gaa5ephrgq4gldjq',
  scope: 'openid email profile',
  response_type: 'code',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  redirect_uri: loc.origin.concat('/callback'),
  post_logout_redirect_uri: loc.origin.concat('/'),
};

Log.logger = console;
Log.level = Log.INFO;

export default userManagerConfig;

import {
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool, CognitoIdentityCredentials } from '@aws-sdk/credential-provider-cognito-identity';
import {
  REGION,
  IDENTITY_POOL_ID,
  USER_POOL_ID,
  ACCOUNT_ID,
} from '../config/awsConfig';

function saveCredentials(credentials: CognitoIdentityCredentials) {
  localStorage.setItem('credentials', JSON.stringify(credentials));
}

function removeCredentials() {
  localStorage.removeItem('credentials');
}

export default class CognitoService {
  static client(): CognitoIdentityProviderClient {
    return new CognitoIdentityProviderClient({
      region: REGION,
      credentials: this.getCredentials() ?? this.throwOnMissingAuth(),
    });
  }

  static getCredentials(): CognitoIdentityCredentials | null {
    return JSON.parse(localStorage.getItem('credentials') ?? 'null');
  }

  static throwOnMissingAuth(): never {
    throw new Error('Invalid authentication result');
  }

  static saveIdToken(IdToken: string) {
    localStorage.setItem('id_token', JSON.stringify(IdToken));
  }

  static getIdToken(): string | undefined {
    return JSON.parse(localStorage.getItem('id_token') ?? 'undefined');
  }

  // Handles the getId protocol and the getCredentialsForIdentiry protocol.
  static async signIn(IdToken: string | undefined): Promise<string> {
    try {
      const credentials = await fromCognitoIdentityPool({
        accountId: ACCOUNT_ID,
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL_ID,
        logins: {
          [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: IdToken ?? this.throwOnMissingAuth(),
        },
      })();
      saveCredentials(credentials);
      return 'succes';
    } catch (err) {
      console.log(err);

      return 'failure';
    }
  }

  static signOut() {
    removeCredentials();
  }
}

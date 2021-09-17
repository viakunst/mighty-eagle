import {
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool, CognitoIdentityCredentials } from '@aws-sdk/credential-provider-cognito-identity';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import {
  REGION,
  IDENTITY_POOL_ID,
  USER_POOL_ID,
  ACCOUNT_ID,
} from '../config/awsConfig';

function throwOnMissingAuth(): never {
  throw new Error('Invalid authentication result');
}

function saveCredentials(credentials: CognitoIdentityCredentials) {
  localStorage.setItem('credentials', JSON.stringify(credentials));
}

function removeCredentials() {
  localStorage.removeItem('credentials');
}

function getCredentials(): CognitoIdentityCredentials | null {
  return JSON.parse(localStorage.getItem('credentials') ?? 'null');
}

export default class Cognito {
  static client(): CognitoIdentityProviderClient {
    return new CognitoIdentityProviderClient({
      region: REGION,
      credentials: getCredentials() ?? throwOnMissingAuth(),
    });
  }

  // Handles the getId protocol and the getCredentialsForIdentiry protocol.
  static async signIn(IdToken: string | undefined): Promise<string> {
    try {
      const credentials = await fromCognitoIdentityPool({
        accountId: ACCOUNT_ID,
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL_ID,
        logins: {
          [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: IdToken ?? throwOnMissingAuth(),
        },
      })();
      saveCredentials(credentials);
      return 'succes';
    } catch (err) {
      console.log(err);

      return 'failure';
    }
  }

  static async getRole(): Promise<string> {
    const sts = new STSClient({
      region: REGION,
      credentials: getCredentials() ?? throwOnMissingAuth(),
    });
    const stsCommand = new GetCallerIdentityCommand({});
    const response = await sts.send(stsCommand);
    if (response.Arn) {
      const roleArray = response.Arn.split('/');
      switch (roleArray[1]) {
        case 'CognitoPowerUser':
          return 'admin';
        default:
          return 'user';
      }
    } else {
      return 'failure';
    }
  }

  static signOut() {
    removeCredentials();
  }
}

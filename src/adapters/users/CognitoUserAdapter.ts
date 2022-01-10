import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool, CognitoIdentityCredentials } from '@aws-sdk/credential-provider-cognito-identity';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import {
  REGION,
  IDENTITY_POOL_ID,
  USER_POOL_ID,
  ACCOUNT_ID,
} from '../../config/awsConfig';
import CognitoService from '../../helpers/CognitoService';

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

export default class CognitoUserAdapter {
  static async CreateUser(createUserAttributes: any, username: any, userPoolId: any) {
    try {
      await CognitoService.client().send(new AdminCreateUserCommand({
        DesiredDeliveryMediums: ['EMAIL'],
        MessageAction: 'SUPPRESS',
        TemporaryPassword: 'Password@111222',
        UserAttributes: createUserAttributes,
        Username: username,
        UserPoolId: userPoolId ?? undefined,
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  static async DeleteUser(user: any, userPoolId: any) {
    try {
      await CognitoService.client().send(new AdminDeleteUserCommand({
        UserPoolId: userPoolId ?? undefined,
        Username: user?.Username ?? '',
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  static async UpdateUser(userAttributes: any, user: any, userPoolId: any) {
    try {
      await CognitoService.client().send(new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId ?? undefined,
        Username: user?.Username ?? '',
        UserAttributes: userAttributes,
      }));
      return true;
    } catch (e) {
      return false;
    }
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

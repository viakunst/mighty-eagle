import {
  AttributeType,
  CognitoIdentityProviderClient, CognitoIdentityProviderClientConfig,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool, CognitoIdentityCredentials } from '@aws-sdk/credential-provider-cognito-identity';
import {
  REGION,
  IDENTITY_POOL_ID,
  USER_POOL_ID,
  ACCOUNT_ID,
} from '../config/awsConfig';
import { UserAttributes } from '../adapters/users/UserAdapter';
import OidcService from './OidcService';

const CREDENTIALS = 'credentials';

export default class CognitoService {
  static client(): CognitoIdentityProviderClient {
    return new CognitoIdentityProviderClient(this.config());
  }

  static config(): CognitoIdentityProviderClientConfig {
    const credentials: CognitoIdentityCredentials | null = JSON.parse(localStorage.getItem(CREDENTIALS) ?? 'null');
    return {
      region: REGION,
      credentials: credentials ?? OidcService.throwOnMissingAuth(),
    };
  }

  static awsAttributesToRecord(awsAttributes: AttributeType[]): UserAttributes {
    // map response.UserAttributes to a record, skip records that don't have a value for Name
    return awsAttributes.reduce((acc, attr) => (attr.Name ? ({
      ...acc,
      [attr.Name]: attr.Value,
    }) : acc), {});
  }

  static recordToAwsAttributes(record: UserAttributes): AttributeType[] {
    // map record entries as key/value pairs to an AttributeType object, mapping null to undefined
    return Object.entries(record).map(([key, value]) => ({ Name: key, Value: value ?? undefined }));
  }

  // Handles the getId protocol and the getCredentialsForIdentiry protocol.
  static async signIn(idToken?: string): Promise<void> {
    const credentials = await fromCognitoIdentityPool({
      accountId: ACCOUNT_ID,
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken ?? OidcService.throwOnMissingAuth(),
      },
    })();

    localStorage.setItem(CREDENTIALS, JSON.stringify(credentials));
  }

  static signOut() {
    localStorage.removeItem(CREDENTIALS);
  }
}

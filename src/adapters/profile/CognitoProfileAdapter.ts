import { GetUserCommand, UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import CognitoService from '../../helpers/CognitoService';
import { UserAttributes } from '../users/UserAdapter';
import ProfileAdapter from './ProfileAdapter';

/* eslint class-methods-use-this:0 */
export default class CognitoProfileAdapter implements ProfileAdapter {
  async updateUser(accessToken: string, attributes: UserAttributes) {
    const command = new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: CognitoService.recordToAwsAttributes(attributes),
    });

    await CognitoService.client().send(command);
  }

  async getUser(accessToken: string) {
    const response = await CognitoService.client().send(new GetUserCommand({
      AccessToken: accessToken,
    }));

    if (!response.Username || !response.UserAttributes) {
      return null;
    }

    const userAttributes = CognitoService.awsAttributesToRecord(response.UserAttributes);

    // return user object
    return {
      username: response.Username,
      userAttributes,
    };
  }

  async getRole(): Promise<string> {
    const sts = new STSClient(CognitoService.config());
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
}

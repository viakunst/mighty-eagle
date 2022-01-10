import { GetUserCommand, UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { REGION } from '../../config/awsConfig';
import CognitoService from '../../helpers/CognitoService';

const awsManager = {
  update: async function getUserData(userData: any, attributes: any) {
    // async?
    // Map dict to objects for command

    const params = {
      AccessToken: userData.user?.access_token,
      UserAttributes: attributes,
    };

    const command = new UpdateUserAttributesCommand(params);

    return CognitoService.client().send(command);
  },

  async UserAttributes(userData: any) {
    const response = await CognitoService.client().send(new GetUserCommand({
      AccessToken: userData.user?.access_token,
    }));
    return response.UserAttributes;
  },

  async getRole(): Promise<string> {
    const sts = new STSClient({
      region: REGION,
      credentials: CognitoService.getCredentials() ?? CognitoService.throwOnMissingAuth(),
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
  },

};

export default awsManager;

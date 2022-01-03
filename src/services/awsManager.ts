import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import awsConfig from '../config/awsConfig';

const awsManager = {
  client: new CognitoIdentityProviderClient(awsConfig),

  update: async function getUserData(userData: any, attributes: any) {
    // async?
    // Map dict to objects for command

    const params = {
      AccessToken: userData.user?.access_token,
      UserAttributes: attributes,
    };

    const command = new UpdateUserAttributesCommand(params);

    return this.client.send(command);
  },

};

export default awsManager;

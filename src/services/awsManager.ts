import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import awsConfig from '../config/awsConfig';

const awsManager = {
  client: new CognitoIdentityProviderClient(awsConfig),
  update: async function getUserData(userData: any, dict: any) {
    // async?
    // Map dict to objects for command
    const attributes: any = [];

    dict.array.forEach((key: any) => {
      attributes.push({
        Name: key,
        Value: dict[key],
      });
    });

    const params = {
      AccessToken: userData.AccessToken,
      UserAttributes: attributes,
    };

    const command = new UpdateUserAttributesCommand(params);

    return this.client.send(command);
  },
};

export default awsManager;

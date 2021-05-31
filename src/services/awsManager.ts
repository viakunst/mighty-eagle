import awsConfig from '../config/awsConfig';
import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";

const awsManager = {
  client: new CognitoIdentityProviderClient(awsConfig),
  update: async function(userData:any, dict:any) { // async?
    // Map dict to objects for command
    var attributes = [];
    for (var key in dict){
      attributes.push({
        Name: key,
        Value: dict[key]
      });
    }

    const params = {
      AccessToken: userData.AccessToken,
      UserAttributes: attributes,
    };

    const command = new UpdateUserAttributesCommand(params);

    return this.client.send(command);
  }
}

export default awsManager;
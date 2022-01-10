import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import CognitoService from '../../helpers/CognitoService';

export default class CognitoUserAdapter {
  static async GetUser(username: any, userPoolId: any) {
    try {
      return await CognitoService.client().send(new AdminGetUserCommand({
        UserPoolId: userPoolId ?? undefined,
        Username: username,
      }));
    } catch (err) {
      return false;
    }
  }

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

  /* eslint no-await-in-loop:0 */
  // AWS does not allow you to fetch the entire list at once.
  // So therefore I put a await in a loop to iterate through the entire user pool.
  // This is going to be slow as the list goes toward 1000 users.
  static async ListUsers(userPoolId: string | null, filter:string | undefined = undefined) {
    let users:any = [];
    let response = await CognitoService.client().send(new ListUsersCommand({
      UserPoolId: userPoolId ?? undefined,
      Filter: filter,
    }));

    users = users.concat(response.Users);
    while (response.PaginationToken) {
      response = await CognitoService.client().send(new ListUsersCommand({
        UserPoolId: userPoolId ?? undefined,
        Filter: filter,
        PaginationToken: response.PaginationToken,
      }));
      users = users.concat(response.Users);
    }

    return users;
  }

  static async UserSetEnabled(enabled: boolean, username: any, userPoolId: any) {
    const params = {
      Username: username,
      UserPoolId: userPoolId ?? undefined,
    };

    try {
      CognitoService.client().send(enabled
        ? new AdminEnableUserCommand(params)
        : new AdminDisableUserCommand(params));
      return true;
    } catch (e) {
      return false;
    }
  }
}

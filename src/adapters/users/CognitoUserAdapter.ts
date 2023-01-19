import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminResetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  AttributeType,
  ListUserPoolsCommand,
  ListUsersCommand,
  ListUsersCommandOutput,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import CognitoService from '../../helpers/CognitoService';
import UserAdapter, { Username, User, UserAttributes } from './UserAdapter';

export default class CognitoUserAdapter implements UserAdapter {
  id!: string;

  userPoolId!: string;

  async getUser(username: Username): Promise<User | null> {
    const response = await CognitoService.client().send(new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    }));

    if (!response.UserAttributes) {
      return null;
    }

    const userAttributes = CognitoService.awsAttributesToRecord(response.UserAttributes);

    // return user object
    return {
      username,
      userAttributes,
      status: response.UserStatus,
      created: response.UserCreateDate,
      modified: response.UserLastModifiedDate,
      enabled: response.Enabled,
    };
  }

  async createUser(username: string, userAttributes: UserAttributes) {
    const awsAttributes: AttributeType[] = CognitoService.recordToAwsAttributes(userAttributes);

    // Password is generated by Cognito, no client action required.
    await CognitoService.client().send(new AdminCreateUserCommand({
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: awsAttributes,
      Username: username,
      UserPoolId: this.userPoolId,
    }));
  }

  async resendInvitation(user: User) {
    if (user.userAttributes !== null && user.userAttributes.email !== null) {
      // Hard coded email field, but as in Cognito this field is required for all accounts.
      // It should be acceptable.
      const { email } = user.userAttributes;

      await CognitoService.client().send(new AdminCreateUserCommand({
        DesiredDeliveryMediums: ['EMAIL'],
        MessageAction: 'RESEND',
        Username: email,
        UserPoolId: this.userPoolId,
      }));
    }
  }

  async forcePasswordReset(user: User) {
    if (user.userAttributes !== null && user.userAttributes.email !== null) {
      // Hard coded email field, but as in Cognito this field is required for all accounts.
      // It should be acceptable.
      const { email } = user.userAttributes;

      await CognitoService.client().send(new AdminResetUserPasswordCommand({
        Username: email,
        UserPoolId: this.userPoolId,
      }));
    }
  }

  async deleteUser(username: string) {
    await CognitoService.client().send(new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    }));
  }

  async updateUser(username: string, userAttributes: UserAttributes) {
    const awsAttributes = CognitoService.recordToAwsAttributes(userAttributes);
    // This is always required, else AWS wont send emails.
    console.log('updateUser');
    awsAttributes.push({ Name: 'email_verified', Value: 'true' });
    await CognitoService.client().send(new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: awsAttributes,
    }));
    await this.verifyEmail(username);
  }

  async verifyEmail(username: string) {
    console.log('verify');
    const awsAttributes = [{ Name: 'email_verified', Value: 'true' }];
    await CognitoService.client().send(new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: awsAttributes,
    }));
  }

  /* eslint no-await-in-loop:0 */
  // AWS does not allow you to fetch the entire list at once.
  // So therefore I put a await in a loop to iterate through the entire user pool.
  // This is going to be slow as the list goes toward 1000 users.
  async listUsers(filter?: string) {
    let users: User[] = [];
    let paginationToken;

    do {
      // send command to fetch users
      const cmd = new ListUsersCommand({
        UserPoolId: this.userPoolId,
        Filter: filter,
        PaginationToken: paginationToken,
      });
      const response: ListUsersCommandOutput = await CognitoService.client().send(cmd);

      // convert and add the fetched users
      const addUser = (acc: User[], awsUser: UserType) => {
        if (!awsUser.Username) return acc;
        const user: User = ({
          username: awsUser.Username,
          userAttributes: CognitoService.awsAttributesToRecord(awsUser.Attributes ?? []),
          status: awsUser.UserStatus,
          created: awsUser.UserCreateDate,
          modified: awsUser.UserLastModifiedDate,
          enabled: awsUser.Enabled,
        });
        return [...acc, user];
      };
      users = response.Users?.reduce(addUser, users) ?? users;

      // update pagination token
      paginationToken = response.PaginationToken;
    } while (paginationToken);

    return users;
  }

  async userSetEnabled(username: string, enabled: boolean) {
    const params = {
      Username: username,
      UserPoolId: this.userPoolId,
    };

    CognitoService.client().send(enabled
      ? new AdminEnableUserCommand(params)
      : new AdminDisableUserCommand(params));
  }

  static async fetchAllUserpools(): Promise<Record<string, CognitoUserAdapter>> {
    const response = await CognitoService.client().send(new ListUserPoolsCommand({
      MaxResults: 60,
    }));
    return response.UserPools?.reduce((acc: Record<string, CognitoUserAdapter>, descr) => {
      const adapter = new CognitoUserAdapter();
      adapter.id = descr.Name ?? descr.Id ?? '';
      adapter.userPoolId = descr.Id ?? '';
      return {
        ...acc,
        [adapter.id]: adapter,
      };
    }, {}) ?? {};
  }
}

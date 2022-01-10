import { AdminGetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

export default interface UserAdapter {
  GetUser(username: any, userPoolId: any): Promise<AdminGetUserCommandOutput>;
  CreateUser(createUserAttributes: any, username: any, userPoolId: any): Promise<boolean>;
  DeleteUser(user: any, userPoolId: any): Promise<boolean>;
  UpdateUser(userAttributes: any, user: any, userPoolId: any): Promise<boolean>;
  ListUsers(userPoolId: string | null, filter:string | undefined): Promise<any>;
  UserSetEnabled(enabled: boolean, username: any, userPoolId: any): Promise<boolean>;
}

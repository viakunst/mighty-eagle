import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

export default interface ProfileAdapter {
  UpdateUser(userData: any, attributes: any): Promise<boolean>;
  GetUser(userData: any): Promise<AttributeType[] | undefined>;
  GetRole(): Promise<string>;
}

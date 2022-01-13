import { User, UserAttributes } from '../users/UserAdapter';

export default interface ProfileAdapter {
  updateUser(accessToken: string, attributes: UserAttributes): Promise<void>;
  getUser(accessToken: string): Promise<User | null>;
  getRole(): Promise<string>;
}

import { makeUserManager } from 'react-oidc';
import userManagerConfig from '../config/userManagerConfig';

export default makeUserManager(userManagerConfig);

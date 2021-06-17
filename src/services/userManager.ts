import { makeUserManager } from 'react-oidc';
import userManagerConfig from '../config/userManagerConfig';

const userManager = makeUserManager(userManagerConfig);

export default userManager;

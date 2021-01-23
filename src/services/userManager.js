import { makeUserManager } from "react-oidc";
import userManagerConfig from './userManagerConfig'

const userManager = makeUserManager(userManagerConfig)

export default userManager;
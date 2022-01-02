import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { userAttributeConfig } from '../config/attributeConfig';

export default class UserAttributesData {
  public userAttributes: { [key:string]:any } = {};

  constructor() {
    this.userAttributes = {};
  }

  parseUserData = (userData:any) => {
    if (userData.user) {
      const profile = userData.user?.profile;
      userAttributeConfig.forEach((att) => {
        this.addAttribute(att.getAttribute(), profile[att.getAttribute()]);
      });
    }
  };

  parseAWS = (data:AttributeType[]) => {
    data.forEach((att) => {
      if (att.Name !== undefined) {
        this.addAttribute(att.Name, att.Value);
      }
    });
  };

  addAttribute = (key:string, value:any) => {
    this.userAttributes = ({
      ...this.userAttributes,
      [key]: value,
    });
  };

  getAttribute = (key:string) => this.userAttributes[key];
}

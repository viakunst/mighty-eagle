import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

// Type class for parsing profile data.
export default class UserAttributesData {
  public userAttributes: { [key:string]:any } = {};

  constructor(data?:AttributeType[]) {
    if (data !== undefined) {
      this.userAttributes = {};
      this.parseAWS(data);
    } else {
      this.userAttributes = {};
    }
  }

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

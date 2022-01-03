import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import {
  FormInstance,
} from 'antd';

interface UserAttributeData {
  getAttribute(arg1:string): (arg1:string) => any;
}

// Type class for parsing form data.
export default class AttributeConfig {
  public configAttributes: any[];

  constructor(config:any[]) {
    this.configAttributes = config;
  }

  extend = (config:any[]) => new AttributeConfig([...this.configAttributes, ...config]);

  getColumnItems = (data:UserAttributeData) => {
    const columnData:any[] = [];
    this.configAttributes.forEach((att) => {
      columnData.push(att.view(data));
    });
    return columnData;
  };

  getFormItems = (data:UserAttributeData | null) => {
    const formItems = this.configAttributes.map(
      (attribute) => {
        if (data) {
          return (attribute.edit(data.getAttribute(attribute.getAttribute())));
        }
        return (attribute.edit(null));
      },
    );
    return formItems;
  };

  getAWSAttributes = (form:FormInstance) => {
    const updatedUserAttributes: AttributeType[] = [];
    this.configAttributes.forEach((at) => {
      updatedUserAttributes.push({
        Name: at.getAttribute(),
        Value: at.value(form.getFieldValue(`attributes[${at.getAttribute()}]`)),
      });
    });
    return updatedUserAttributes;
  };
}

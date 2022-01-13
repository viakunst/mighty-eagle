import {
  FormInstance,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';

// Type class for parsing form data.
export default class AttributeConfig {
  public configAttributes: any[];

  constructor(config:any[]) {
    this.configAttributes = config;
  }

  extend = (config:any[]) => new AttributeConfig([...this.configAttributes, ...config]);

  getColumnItems = (data:UserAttributes) => {
    const columnData:any[] = [];
    this.configAttributes.forEach((attr) => {
      columnData.push(attr.view(data));
    });
    return columnData;
  };

  getFormItems = (data:UserAttributes | null) => this.configAttributes.map(
    (attribute) => {
      if (data) {
        return (attribute.edit(data[attribute.getAttribute()]));
      }
      return (attribute.edit(null));
    },
  );

  getAWSAttributes = (form:FormInstance) => {
    const updatedUserAttributes: UserAttributes = this.configAttributes.reduce((acc, attr) => ({
      ...acc,
      [attr.getAttribute()]: attr.value(form.getFieldValue(`attributes[${attr.getAttribute()}]`)),
    }), {});
    return updatedUserAttributes;
  };
}

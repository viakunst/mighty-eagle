import {
  FormInstance,
} from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from './AttributeInstance';

// Type class for parsing form data.
export default class AttributeConfig {
  public configAttributes: AttributeInstance<any>[];

  constructor(config:AttributeInstance<any>[]) {
    this.configAttributes = config;
  }

  extend = (config:AttributeInstance<any>[]) => new AttributeConfig([
    ...this.configAttributes,
    ...config,
  ]);

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
        return (attribute.edit(data[attribute.attribute]));
      }
      return (attribute.edit(null));
    },
  );

  getAWSAttributes = (form:FormInstance) => {
    const updatedUserAttributes: UserAttributes = this.configAttributes.reduce((acc, attr) => {
      let value = form.getFieldValue(`attributes[${attr.attribute}]`);
      if (attr.fromForm) {
        value = attr.fromForm(form);
      }
      return ({
        ...acc,
        [attr.attribute]: attr.serialize(value),
      });
    }, {});

    return updatedUserAttributes;
  };
}

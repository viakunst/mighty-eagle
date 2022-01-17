import React from 'react';
import { FormInstance } from 'antd';

import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../attributesClass/AttributeInstance';
import AttributeConfigData from '../attributesClass/AttributeConfigData';
import AttributeExpression from '../attributesClass/AttributeExpression';

export default function CompoundTextAttribute({
  Name,
  Attribute,
  Expression,
}: AttributeConfigData): AttributeInstance<string> {
  return {
    attribute: Attribute,
    view: (userData: UserAttributes) => {
      if (Expression) {
        const expr = AttributeExpression({ Expression });
        return ({
          title: Name,
          key: Name,
          value: (<>{expr.eval(userData)}</>),
        });
      }
      return ({
        title: Name,
        key: Name,
        value: (<>Undefined expression</>),
      });
    },
    // Never use this, the value comes from the expression.
    edit: () => (
      <></>
    ),
    parse: (serialized: string) => serialized,
    serialize: (value: string) => value,
    fromForm: (form: FormInstance) => {
      if (Expression) {
        const expr = AttributeExpression({ Expression });
        return expr.evalFromForm(form);
      }
      return 'Undefined expression';
    },
  };
}

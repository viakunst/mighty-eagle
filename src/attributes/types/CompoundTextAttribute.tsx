import React from 'react';
import { FormInstance } from 'antd';

import { UserAttributes } from '../../adapters/users/UserAdapter';
import AttributeInstance from '../AttributeInstance';
import AttributeConfigData from '../AttributeConfigData';
import AttributeExpression from '../AttributeExpression';

export interface CompoundOptions {
  expression: string
}

export default function CompoundTextAttribute({
  name,
  attribute,
  options: {
    expression,
  },
}: AttributeConfigData<CompoundOptions>): AttributeInstance<string> {
  return {
    attribute,
    view: (userData: UserAttributes) => {
      if (expression) {
        const expr = AttributeExpression({ expression });
        return ({
          title: name,
          key: name,
          value: (<>{expr.eval(userData)}</>),
        });
      }
      return ({
        title: name,
        key: name,
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
      if (expression) {
        const expr = AttributeExpression({ expression });
        return expr.evalFromForm(form);
      }
      return 'Undefined expression';
    },
  };
}

import { FormInstance } from 'antd';
import { UserAttributes } from '../adapters/users/UserAdapter';

interface ExpressionConfig {
  expression: string,
}

interface ExpressionPart {
  value: string,
  attribute: string | null,
}

interface ExpressionInstance {
  expression: string;
  eval: (userData: UserAttributes) => string;
  evalFromForm: (form: FormInstance) => string;
}

function getSplitExpression(expr: string, arr: ExpressionPart[] | null): ExpressionPart[] {
  const openIndex = expr.indexOf('{{');
  const closeIndex = expr.indexOf('}}');
  let ret: ExpressionPart[] = [];
  if (arr != null) {
    ret = arr;
  }

  if (openIndex >= 0 && closeIndex >= 0) {
    ret.push({ value: expr.substr(0, openIndex), attribute: null });
    ret.push({ value: '', attribute: expr.substr(openIndex + 2, closeIndex - openIndex - 2) });
    return getSplitExpression(expr.substr(closeIndex + 2), ret);
  }
  ret.push({ value: expr, attribute: null });
  return ret;
}

export default function AttributeExpression({
  expression,
}: ExpressionConfig): ExpressionInstance {
  return {
    expression,
    eval: (userData: UserAttributes) => {
      const splitExpr: ExpressionPart[] = getSplitExpression(expression, null);
      let str = '';
      splitExpr.forEach((part) => {
        if (part.attribute != null) {
          if (userData[part.attribute] != null) {
            const va1r = userData[part.attribute];
            if (va1r != null) {
              str = str.concat(va1r);
            }
          } else {
            str = str.concat(part.value);
          }
        } else {
          str = str.concat(part.value);
        }
      });
      return str;
    },
    evalFromForm: (form: FormInstance) => {
      const splitExpr: ExpressionPart[] = getSplitExpression(expression, null);
      let str = '';
      splitExpr.forEach((part) => {
        if (part.attribute != null) {
          const value = form.getFieldValue(`attributes[${part.attribute}]`);
          if (value != null) {
            str = str.concat(value);
          } else {
            str = str.concat(part.value);
          }
        } else {
          str = str.concat(part.value);
        }
      });
      return str;
    },
  };
}

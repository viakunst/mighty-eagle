import { FormInstance } from 'antd';
import { UserAttributes } from '../../adapters/users/UserAdapter';

interface ExpressionConfig {
  Expression: string,
}

interface ExpressionPart {
  Value: string,
  Attribute: string | null,
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
    ret.push({ Value: expr.substr(0, openIndex), Attribute: null });
    ret.push({ Value: 'unknown', Attribute: expr.substr(openIndex + 2, closeIndex - openIndex - 2) });
    return getSplitExpression(expr.substr(closeIndex + 2), ret);
  }
  ret.push({ Value: expr, Attribute: null });
  return ret;
}

export default function AttributeExpression({
  Expression,
}: ExpressionConfig): ExpressionInstance {
  return {
    expression: Expression,
    eval: (userData: UserAttributes) => {
      const splitExpr: ExpressionPart[] = getSplitExpression(Expression, null);
      let str: string = '';
      splitExpr.forEach((part) => {
        if (part.Attribute != null) {
          if (userData[part.Attribute] != null) {
            const va1r = userData[part.Attribute];
            if (va1r != null) {
              str = str.concat(va1r);
            }
          } else {
            str = str.concat(part.Value);
          }
        } else {
          str = str.concat(part.Value);
        }
      });
      return str;
    },
    evalFromForm: (form: FormInstance) => {
      const splitExpr: ExpressionPart[] = getSplitExpression(Expression, null);
      let str: string = '';
      splitExpr.forEach((part) => {
        if (part.Attribute != null) {
          const value = form.getFieldValue(`attributes[${part.Attribute}]`);
          if (value != null) {
            str = str.concat(value);
          } else {
            str = str.concat(part.Value);
          }
        } else {
          str = str.concat(part.Value);
        }
      });
      return str;
    },
  };
}

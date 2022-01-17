import BaseAttribute from './BaseAttribute';

export default function TextAttribute({
  Name, Attribute, Description, Required, Placeholder,
}: any) {
  const baseObj = BaseAttribute({
    Name, Attribute, Description, Required, Placeholder,
  });

  console.log(baseObj);
  return baseObj;
}

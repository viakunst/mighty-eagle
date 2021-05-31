import { Field, ErrorMessage } from 'formik';

export default function TextAttribute({ Name, Attribute, Description }:any) {
  return {
    attribute: Attribute,
    view: (userData:any) => (
      <tr>
        <th>{ Name }</th>
        <td>{ userData?.user.profile[Attribute] }</td>
      </tr>
    ),
    edit: () => (
      <>
        <Field type="text" name={Name} />
        <ErrorMessage name={Name} component="div" />
      </>
    ),
    validate: (value:any) => { }
  }
}
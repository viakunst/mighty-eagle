import { Field, ErrorMessage } from 'formik';

export default function TextAttribute({ Name, Attribute }) {
  return {
    attribute: Attribute,
    view: (userData) => (
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
    validate: (value) => { }
  }
}
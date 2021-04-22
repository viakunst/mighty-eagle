import { Field, ErrorMessage } from 'formik';

export default function BooleanAttribute({ Name, Attribute }) {
  return {
    view: (userData) => (
      <tr>
        <th>{ Name }</th>
        <td>{ userData?.user.profile[Attribute] }</td>
      </tr>
    ),
    edit: () => (
      <>
        <Field type="checkbox" name={Name} />
        <ErrorMessage name={Name} component="div" />
      </>
    ),
    validate: (value) => { }
  }
}
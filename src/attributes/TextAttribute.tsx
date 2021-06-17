import React from 'react';
import { Field, ErrorMessage } from 'formik';

export default function TextAttribute({ Name, Attribute, Description }: any) {
  return {
    attribute: Attribute,
    view: (userData: any) => {
      const { user } = userData;
      return (
        <tr>
          <th>{Name}</th>
          <td>{user.profile[Attribute]}</td>
        </tr>
      );
    },
    edit: () => (
      <>
        <Field type="text" name={Name} />
        <ErrorMessage name={Name} component="div" />
      </>
    ),
    validate: (value: any) => {
      if (value != null) {
        return true;
      }
      return false;
    },
    getName: () => Name,
    getDescription: () => Description,
  };
}

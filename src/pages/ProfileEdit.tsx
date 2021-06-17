import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserData } from 'react-oidc';
import { Formik, Form } from 'formik';

import '../style/Profile.css';
import attributeConfig from '../config/attributeConfig';
import awsManager from '../services/awsManager';

export default function ProfileEdit() {
  const userData = useContext(UserData);

  // Render all attributes
  const rows: any[] = [];

  attributeConfig.forEach(
    (attribute) => rows.push(attribute.edit()),
  );

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const results = await awsManager.update(userData, values);
      console.log(results);
    } catch (err) {
      console.error(err);
    }

    setSubmitting(false);
  };

  const onValidate = (values: any) => {
    const errors: any = {};

    attributeConfig.forEach(
      (attribute) => {
        const error = attribute.validate(values[attribute.getName()]);
        if (error !== null && error) {
          errors[attribute.getName()] = error;
        }
      },
    );

    return errors;
  };

  return (
    <div className="profile card row">
      <h2>Profiel bewerken</h2>
      <div className="table">
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={onValidate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {rows}
              <button type="submit" disabled={isSubmitting}>
                Opslaan
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <br />
      <Link to="/">Annuleren</Link>
    </div>
  );
}

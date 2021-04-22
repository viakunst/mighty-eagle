import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { UserData } from "react-oidc";
import '../style/Profile.css';
import attributeConfig from '../../config/attributeConfig';
import awsManager from'../services/awsManager';
import { Formik, Form } from 'formik';

export default function ProfileEdit() {
  const userData = useContext(UserData);
  
  // Render all attributes
  let rows = [];
  for (const { edit } of attributeConfig) {
    rows.push(edit());
  }
  
  const onSubmit = (values, { setSubmitting }) => {
    try {
      const results = await awsManager.update(userData, values);
      console.log(results);
    } catch (err) {
      console.error(err);
    }
    
    setSubmitting(false);
  }

  const onValidate = (values) => {
    const errors = {};
    for (const { attribute, validate } of attributeConfig) {
      const error = validate(values[attribute]);
      if (error) {
        errors[attribute] = error;
      }
    }
    return errors;
  }

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
              { rows }
              <button type="submit" disabled={isSubmitting}>Opslaan</button>
            </Form>
          )}
        </Formik>
      </div>
      <br />
      <Link to="/">Annuleren</Link>
  </div>
  );
}

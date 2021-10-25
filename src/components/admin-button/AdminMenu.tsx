import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Cognito from '../../services/cognito';

export default class AdminMenu extends Component<{}, { admin: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      admin: 'user',
    };
  }

  async componentDidMount() {
    // TO-DO: check if Cognito has his credentials.
    Cognito.getRole().then((value) => {
      this.setState({ admin: value });
    }).catch((err) => console.log('ERROR', err));
  }

  render() {
    const {
      admin,
    } = this.state;

    if (admin === 'admin') {
      return (
        <>
          <Link to="/admin">Beheer</Link> | {' '}
        </>
      );
    }

    return (<>no admin</>);
  }
}

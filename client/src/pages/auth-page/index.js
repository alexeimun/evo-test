import React from 'react';
import SignupPage from '../signup-page';
import LoginPage from '../login-page';


class AuthPage extends React.PureComponent {
  state = {
    page: 'login'
  };

  handlePageChange = (page) => {
    this.setState({ page });
  };

  render() {
    const { page } = this.state;

    return page === 'login'
      ? <LoginPage onPageChange={this.handlePageChange} />
      : <SignupPage onPageChange={this.handlePageChange} />;
  }
}

export default AuthPage;

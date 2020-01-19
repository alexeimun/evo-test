import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { FormProps } from '../../render-props';
import AuthPageLayout from '../../layouts/auth-page';
import Feedback from '../../components/common/feedback';
import ButtonLink from '../../components/common/button-link';
import SignupForm from "../../components/auth/signup-form";

class SignupPage extends React.PureComponent {
  state = {
    view: 'emailView',
    email: '',
    password:''
  };

  render() {
    const { client, onPageChange } = this.props;
    const { view } = this.state;

    const loginLink = (
      <ButtonLink onClick={() => { onPageChange('login'); }}>
        Iniciar Sesión
      </ButtonLink>
    );

    return (
      <FormProps>
        {({
          disabled,
          errorMsg,
          successMsg,
          handleBefore,
          handleClientCancel,
          handleClientError,
          handleServerError,
          handleSuccess,
        }) => (
          <AuthPageLayout
            title={view === 'emailView' && 'Registrarse'}
            subtitle={view === 'emailView' && 'Ya tienes una cuenta' }
            link={view === 'emailView' && loginLink}>
            {view === 'emailView' && (
                <SignupForm btnLabel="Registarse" disabled={disabled}
                           onBeforeHook={handleBefore}
                           onClientCancelHook={handleClientCancel}
                           onClientErrorHook={handleClientError}
                           onSuccessHook={({email, password}) => {
                             // Store current user's email and fire signup api call
                             this.setState({email, password});
                           }}
                            onSignupError={handleServerError}
                            onSignupSuccess={({token}) => {
                              handleSuccess(() => {
                               localStorage.setItem('x-auth-token', token);
                               client.resetStore();
                                onPageChange('home')
                             });
                           }}
                />
            )}
            <div className="mb2" />
            <Feedback
              loading={disabled}
              errorMsg={errorMsg}
              successMsg={successMsg}
            />
          </AuthPageLayout>
        )}
      </FormProps>
    );
  }
}

SignupPage.propTypes = {
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }).isRequired,
  onPageChange: PropTypes.func,
};

SignupPage.defaultProps = {
  onPageChange: () => {},
};

export default withApollo(SignupPage);

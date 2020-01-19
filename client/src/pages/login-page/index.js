import React from 'react';
import PropTypes from 'prop-types';
import {withApollo} from 'react-apollo';
import {FormProps} from '../../render-props';
import LoginForm from '../../components/auth/login-form';
import AuthPageLayout from '../../layouts/auth-page';
import Feedback from '../../components/common/feedback';
import ButtonLink from '../../components/common/button-link';

class LoginPage extends React.PureComponent {
    state = {
        view: 'emailView',
        email: '',
        password: ''
    };

    render() {
        const {client, onPageChange} = this.props;
        const {view} = this.state;

        const signupLink = (
            <ButtonLink onClick={() => { onPageChange('signup'); }}>
                Registrarse
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
                        title={view === 'emailView' && 'Iniciar sesión'}
                        subtitle={view === 'emailView' && '¿No tienes cuenta?'}
                        link={view === 'emailView' && signupLink}>
                        {view === 'emailView' && (
                            <LoginForm btnLabel="Iniciar sesión" disabled={disabled}
                                       onBeforeHook={handleBefore}
                                       onClientCancelHook={handleClientCancel}
                                       onClientErrorHook={handleClientError}
                                       onSuccessHook={({email, password}) => {
                                           this.setState({email, password});
                                       }}
                                       onLoginError={handleServerError}
                                       onLoginSuccess={({token}) => {
                                           handleSuccess(() => {
                                               // Store token into browser and resetStore to update client data
                                               localStorage.setItem('x-auth-token', token);
                                               client.resetStore();
                                           });
                                       }}

                            />
                        )}
                        <div className="mb2"/>
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

LoginPage.propTypes = {
    client: PropTypes.shape({
        resetStore: PropTypes.func.isRequired,
    }).isRequired,
    onPageChange: PropTypes.func,
};

LoginPage.defaultProps = {
    onPageChange: () => {},
};

export default withApollo(LoginPage);

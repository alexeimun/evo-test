import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ErrorHandling from 'error-handling-utils';
import isEmail from 'validator/lib/isEmail';
import {graphql} from "react-apollo";
import loginMutation from "../../../graphql/user/mutation/login";

class LoginForm extends React.Component {
  state = {
    email: '',
    password: '',
    errors: {email: [], password: []},
  };

  handleChange = ({ target }) => {
    const { id: field, value } = target;
    const { errors } = this.state;

    // Update value and clear errors for the given field
    this.setState({
      [field]: value,
      errors: ErrorHandling.clearErrors(errors, field),
    });
  };

  validateFields = ({email, password}) => {
    // Initialize errors
    const errors = {
      email: [],
      password: [],
    };

    // Sanitize input
    const _email = email && email.trim(); // eslint-disable-line no-underscore-dangle
    const _password = password && password.trim(); // eslint-disable-line no-underscore-dangle

    if (!_email) {
      errors.email.push('El correo es requerido!');
    } else if (!isEmail(_email)) {
      errors.email.push('Introduzca un correo válido!');
    }

    if (!_password) {
      errors.password.push('La contraseña es requerido!');
    } else if (_password.length < 8) {
      errors.password.push('La contraseña debe tener al menos 8 caracters!');
    }

    return errors;
  };

  clearErrors = () => {
    this.setState({ errors: { email: [], password: [] } });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();

    const {
      onBeforeHook,
      onClientCancelHook,
      onClientErrorHook,
    } = this.props;

    // Run before logic if provided and return on error
    try {
      onBeforeHook();
    } catch (exc) {
      onClientCancelHook();
      return; // return silently
    }

    // Get field values
    const {email, password} = this.state;

    // Clear previous errors if any
    this.clearErrors();

    // Validate fields
    const errors = this.validateFields({ email, password });

    // In case of errors, display on UI and return handler to parent component
    if (ErrorHandling.hasErrors(errors)) {
      this.setState({ errors });
      onClientErrorHook(errors);
      return;
    }
    this.handleSuccess();
  };

  handleSuccess = async () => {
    const {onLoginError, onLoginSuccess, login} = this.props;
    const {email, password} = this.state;


    try {
      const res = await login({variables: {email, password}});
      onLoginSuccess({ token: res.data.login.token });
    } catch (exc) {
      console.log(exc);
      onLoginError(exc);
    }
  };

  render() {
    const { btnLabel, disabled } = this.props;
    const {email, password, errors} = this.state;

    const emailErrors = ErrorHandling.getFieldErrors(errors, 'email');
    const passwordErrors = ErrorHandling.getFieldErrors(errors, 'password');

    return (
      <form
        onSubmit={this.handleSubmit}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="email"
          type="email"
          label="Correo"
          value={email}
          onChange={this.handleChange}
          margin="normal"
          fullWidth
          error={emailErrors.length > 0}
          helperText={emailErrors || ''}
        />
        <div className="mb2" />

        <TextField
          id="password"
          type="password"
          label="Contraseña"
          value={password}
          onChange={this.handleChange}
          margin="normal"
          fullWidth
          error={passwordErrors.length > 0}
          helperText={passwordErrors || ''}
        />
        <div className="mb2" />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={disabled}
        >
          {btnLabel}
        </Button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  btnLabel: PropTypes.string,
  disabled: PropTypes.bool,
  onBeforeHook: PropTypes.func,
  onClientCancelHook: PropTypes.func,
  onClientErrorHook: PropTypes.func,
  onSuccessHook: PropTypes.func,
  onLoginError: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  login: PropTypes.func.isRequired,
};

LoginForm.defaultProps = {
  btnLabel: 'Submit',
  disabled: false,
  onBeforeHook: () => {},
  onClientCancelHook: () => {},
  onLoginSuccess: () => {},
  onLoginError: () => {},
  onClientErrorHook: () => {},
  onSuccessHook: () => {},
};

const withMutation = graphql(loginMutation, { name: 'login' });
export default withMutation(LoginForm);

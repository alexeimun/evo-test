import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ErrorHandling from 'error-handling-utils';
import isEmail from 'validator/lib/isEmail';
import {graphql} from "react-apollo";
import signupMutation from "../../../graphql/user/mutation/signup";

class SignupForm extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    errors: {email: [], password: [], name: []},
  };

  handleChange = ({ target }) => {
    const { id: field, value } = target;
    const { errors } = this.state;

    this.setState({
      [field]: value,
      errors: ErrorHandling.clearErrors(errors, field),
    });
  };

  validateFields = ({ email, password, name }) => {
    // Initialize errors
    const errors = {
      name:[],
      email: [],
      password: [],
    };

    // Sanitize input
    const _email = email && email.trim(); // eslint-disable-line no-underscore-dangle
    const _password = password && password.trim(); // eslint-disable-line no-underscore-dangle
    const _name = name && name.trim(); // eslint-disable-line no-underscore-dangle

    if (!_name) {
      errors.name.push('El nombre es requerido!');
    }
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
    this.setState({errors: {email: [], password: [], name: []}});
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
    const { name,email,password } = this.state;

    // Clear previous errors if any
    this.clearErrors();

    // Validate fields
    const errors = this.validateFields({name,email,password});

    // In case of errors, display on UI and return handler to parent component
    if (ErrorHandling.hasErrors(errors)) {
      this.setState({errors});
      onClientErrorHook(errors);
      return;
    }
    this.handleSuccess();

    // Pass event up to parent component
    // onSuccessHook({email, password});
  };

  handleSuccess = async () => {
    const { onSignupError, onSignupSuccess, signup } = this.props;
    const {name,email,password} = this.state;

    try {
      const res = await signup({variables: {user: {name,email,password}}});
      onSignupSuccess(res.data.signup);
    } catch (exc) {
      console.log(exc);
      onSignupError(exc);
    }
  };

  render() {
    const { btnLabel, disabled } = this.props;
    const {name,email,password, errors} = this.state;

    const emailErrors = ErrorHandling.getFieldErrors(errors, 'email');
    const passwordErrors = ErrorHandling.getFieldErrors(errors, 'password');
    const nameErrors = ErrorHandling.getFieldErrors(errors, 'name');

    return (
      <form
        onSubmit={this.handleSubmit}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="name"
          type="name"
          label="Nombre"
          value={name}
          onChange={this.handleChange}
          margin="normal"
          fullWidth
          error={nameErrors.length > 0}
          helperText={nameErrors || ''}
        />
        <div className="mb2" />

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

SignupForm.propTypes = {
  btnLabel: PropTypes.string,
  disabled: PropTypes.bool,
  onBeforeHook: PropTypes.func,
  onClientCancelHook: PropTypes.func,
  onClientErrorHook: PropTypes.func,
  onSuccessHook: PropTypes.func,
  onSignupError: PropTypes.func,
  onSignupSuccess: PropTypes.func,
  signup: PropTypes.func.isRequired,
};

SignupForm.defaultProps = {
  btnLabel: 'Submit',
  disabled: false,
  onBeforeHook: () => {},
  onClientCancelHook: () => {},
  onLoginSuccess: () => {},
  onLoginError: () => {},
  onClientErrorHook: () => {},
  onSuccessHook: () => {},
};

const withMutation = graphql(signupMutation, { name: 'signup' });
export default withMutation(SignupForm);

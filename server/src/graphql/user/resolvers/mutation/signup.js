const pick = require('lodash/pick');
const { User, validateSignup } = require('../../../../models');
const bcrypt = require('bcrypt');


const signup = async (root, {user: userForm}) => {
  const {email, password, name} = userForm;
  const {error} = validateSignup(userForm);
  if (error) {
    console.log('INVALID SIGNUP CREDENTIALS', error);
    throw new Error(error.details[0].message); // Bad request - 400
  }

  // Make sure user doesn't exist already
  const user = await User.findByEmail(email);
  if (user) {
    console.log('USER ALREADY REGISTERED', user);
    throw new Error('Email already in use'); // Bad request - 400
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = await User.createUser({name, email, password: hash});
  const token = newUser.genAuthToken();


  return {...pick(newUser, ['_id', 'createdAt', 'email']), ...{token}}; // Success request
};

module.exports = signup;

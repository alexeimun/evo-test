const { User, validateLogin } = require('../../../../../models');

//------------------------------------------------------------------------------
// MUTATION:
//------------------------------------------------------------------------------
const login = async (root, {email, password}) => {
  console.log( email, password );

  const {error} = validateLogin({email, password});
  if (error) {
    console.log('INVALID LOGIN CREDENTIALS', error);
    throw new Error(error.details[0].message); // Bad request - 400
  }

  // Make sure user exists
  const user = await User.findByEmail(email);
  if (!user) {
    console.log('USER DOES NOT EXIST');
    throw new Error('Invalid email or password'); // Bad request - 400
  }

  // Make sure the passcode is valid
  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    console.log('INVALID PASSWORD');
    throw new Error('Invalid email or password'); // Bad request - 400
  }

  // Check password's expiration date
  if (user.tokenExpired()) {
    console.log('TOKEN EXPIRED');
    throw new Error('token has expired'); // Bad request - 400
  }


  const token = user.genAuthToken();

  // Successful request
  return { _id: user._id, token };
};

module.exports = login;

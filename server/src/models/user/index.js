/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { JWT_PRIVATE_KEY } = process.env;

const MIN_STRING_LENGTH = 8;
const MAX_STRING_LENGTH = 255;
const MIN_NAME_STRING_LENGTH = 2;


const getExpDate = () => (moment().add(5, 'days').toISOString());

const schema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: MAX_STRING_LENGTH,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: MIN_STRING_LENGTH,
    maxlength: MAX_STRING_LENGTH,
    unique: true,
    required: [true, 'Email address is required'],
    validate: [isEmail, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    minlength: MIN_STRING_LENGTH,
    maxlength: MAX_STRING_LENGTH,
    required: [true, 'Password is required'],
  },
  expirationDate: {
    type: Date,
  },
  // TODO: see jti or jwt balcklist to prevent stolen tokens to pass validation
  // See: https://medium.com/react-native-training/building-chatty-part-7-authentication-in-graphql-cd37770e5ab3
});

schema.methods.validatePassword = function (password) {
  return (password
    && this.password
    && bcrypt.compare(password.toString(), this.password)
  );
};

schema.methods.tokenExpired = function () {
  const now = moment();
  const expDate = moment(getExpDate());
  return expDate.diff(now) < 0;
};

schema.methods.genAuthToken = function () {
  return jwt.sign({ _id: this._id }, JWT_PRIVATE_KEY);
};


schema.statics.findById = function ({_id}) {
  return this.findOne({_id});
};

schema.statics.findByEmail = function (email) {
  return this.findOne({email});
};

schema.statics.createUser = async function (userForm) {
  const newUser = new this(userForm);
  await newUser.save();
  return newUser;
};

const User = mongoose.model('User', schema);

const emailVal = Joi.string().email().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH).required(); // eslint-disable-line
const passwordVal = Joi.string().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH).required(); // eslint-disable-line
const nameVal = Joi.string().min(MIN_NAME_STRING_LENGTH).max(MAX_STRING_LENGTH).required(); // eslint-disable-line

const validateSignup = (user) => {
  const joiSchema = {
    email: emailVal,
    password: passwordVal,
    name: nameVal
  };

  return Joi.validate(user, joiSchema);
};

const validateLogin = (credentials) => {
  const joiSchema = {
    email: emailVal,
    password: passwordVal,
  };

  return Joi.validate(credentials, joiSchema);
};

module.exports = {
  User,
  validateSignup,
  validateLogin,
};

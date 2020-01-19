/* eslint-disable func-names */
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const MIN_STRING_LENGTH = 2;
const MAX_STRING_LENGTH = 255;

const schema = mongoose.Schema({
  userId: {
    type:  mongoose.Schema.ObjectId,
    required: [true, 'UserId is required'],
  },
  title: {
    type: String,
    minlength: 2,
    maxlength: MAX_STRING_LENGTH,
    required: [true, 'Title is required'],
  },
  priority: {
    type: Number,
    required: [true, 'Priority is required'],
  },
  expiresAt: {
    type: Date,
    required: [true, 'ExpiresAt is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schema.statics.getTasksByUserId = function (userId) {
  return this.find({userId});
};

schema.statics.createTask = async function (form) {
  const task = new this(form);
  await task.save();
  return task;
};

const Task = mongoose.model('Task', schema);

const titledVal = Joi.string().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH).required(); // eslint-disable-line
const expiresAtVal = Joi.string().required(); // eslint-disable-line
const priorityVal = Joi.required(); // eslint-disable-line

const validateTask = (task) => {
  const joiSchema = {
    title: titledVal,
    priority: priorityVal,
    expiresAt: expiresAtVal,
  };

  return Joi.validate(task, joiSchema);
};

module.exports = {
  Task,
  validateTask
};

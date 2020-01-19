const { Task } = require('../../../../models');

const tasks = (root, args, ctx) => {
  const { usr } = ctx;

  if (!usr || !usr._id) {
    return null;
  }

  return Task.getTasksByUserId(usr._id);
};

module.exports = tasks;

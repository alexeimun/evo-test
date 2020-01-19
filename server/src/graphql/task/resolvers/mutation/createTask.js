const { Task, validateTask } = require('../../../../models');


const createTask = async (root, {task}, ctx) => {
  console.log(task);

  const {error} = validateTask(task);
  if (error) {
    console.log('INVALID FORM', error);
    throw new Error(error.details[0].message); // Bad request - 400
  }

  const { usr } = ctx;

  if (!usr || !usr._id) {
    return null;
  }

  return Task.createTask({...task, ...{userId: usr._id}});
};

module.exports = createTask;

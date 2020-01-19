const {User, validateSignup, validateLogin} = require('./user');
const {Task, validateTask} = require('./task');

module.exports = {
    User,
    validateSignup,
    validateLogin,
    // Task
    Task,
    validateTask
};

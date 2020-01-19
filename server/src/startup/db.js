/* eslint-disable func-names */
const mongoose = require('mongoose');
const fixtures = require('../fixtures');

const { NODE_ENV, MONGO_URL, MONGO_URL_TEST } = process.env;

console.log(
  '\nprocess.env.NODE_ENV', NODE_ENV,
  '\nprocess.env.MONGO_URL', MONGO_URL,
  '\nprocess.env.MONGO_URL_TEST', MONGO_URL_TEST,
);

const MONGO = NODE_ENV === 'test' ? MONGO_URL_TEST : MONGO_URL;

mongoose.connect(MONGO, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => console.log('DB Connected!')).catch(err => {
  console.log(`DB Connection Error: ${err.message}`);
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
// OBS: don't catch error here. Let mongoose to throw so that we catch the exception using winston
// db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', console.log.bind(console, `Database connected to ${MONGO}`));

// Clean and populate DB
fixtures();

// Required for graphql to properly parse ObjectId
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
  return this.toString();
};

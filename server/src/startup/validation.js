const Joi = require('@hapi/joi');

// Extend Joi validator by adding objectId type
Joi.objectId = require('joi-objectid')(Joi);

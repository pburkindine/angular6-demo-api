const _ = require('lodash');
const Validator = require('validator');

module.exports = function validateRegisterInput(rawData) {
  const errors = {};

  const data = _.cloneDeep(rawData);

  data.name = !_.isEmpty(data.name) ? data.name : '';
  data.email = !_.isEmpty(data.email) ? data.email : '';
  data.password = !_.isEmpty(data.password) ? data.password : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters.';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required.';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'E-mail is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'E-mail field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be 8-30 characters';
  }

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

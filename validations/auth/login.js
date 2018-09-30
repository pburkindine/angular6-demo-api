const _ = require('lodash');
const Validator = require('validator');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !_.isEmpty(data.email) ? data.email : '';
  data.password = !_.isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email) || Validator.isEmpty(data.email)) {
    errors.email = 'Please provide a valid e-mail';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

const _ = require('lodash');
const Validator = require('validator');

module.exports = function validatePostInput(rawData) {
  const errors = {};

  const data = _.cloneDeep(rawData);

  data.price = !_.isEmpty(data.price) ? data.price : '';
  data.imageUri = !_.isEmpty(data.imageUri) ? data.imageUri : '';

  if (!Validator.isDecimal(data.price)) {
    errors.price = 'Price must be a number';
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = 'Price is required';
  }

  if (!Validator.isURL(data.imageUri)) {
    errors.imageUri = 'Image URI invalid';
  }

  if (Validator.isEmpty(data.imageUri)) {
    errors.imageUri = 'Image URI is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

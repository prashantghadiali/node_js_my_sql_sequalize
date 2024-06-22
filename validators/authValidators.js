const { check } = require('express-validator');

const registerValidation = [
  check('firstname').isAlphanumeric().withMessage('First name must be alphanumeric'),
  check('lastname').isAlphanumeric().withMessage('Last name must be alphanumeric'),
  check('email').isEmail().withMessage('Must be a valid email'),
  check('contactNumber').isNumeric().withMessage('Contact number must be numeric'),
  check('postcode').isNumeric().withMessage('Postcode must be numeric'),
  check('hobbies').isString().withMessage('Last name must be alphanumeric'),
  check('gender').isString().withMessage('GEnder must be alphanumeric'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  check('email').isEmail().withMessage('Must be a valid email'),
  check('password').notEmpty().withMessage('Password is required'),
];


module.exports = {
  registerValidation,
  loginValidation,
};

const { body } = require('express-validator');

const createCustomerValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('mobileNumber').notEmpty().isNumeric().withMessage('Mobile number must be numeric'),
    body('email').notEmpty().isEmail(),
];

module.exports = {
    createCustomerValidator
}

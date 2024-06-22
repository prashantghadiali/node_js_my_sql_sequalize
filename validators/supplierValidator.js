const { body } = require('express-validator');

const createSupplierValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('mobileNumber').notEmpty().isNumeric().withMessage('Mobile number must be numeric'),
    body('products').optional(),
];

module.exports = {
    createSupplierValidator
}

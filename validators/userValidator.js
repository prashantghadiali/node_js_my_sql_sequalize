const { param, check } = require('express-validator');

const id = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

const roleId = [
    param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
    check('roleId').isInt().withMessage('Role ID must be an integer')
  ];

module.exports = {id, roleId};
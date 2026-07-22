const { body } = require('express-validator');

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const loginValidators = [
  body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
  registerValidators,
  loginValidators
};

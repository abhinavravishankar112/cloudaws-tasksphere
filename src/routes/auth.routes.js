const express = require('express');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validation.middleware');
const { loginValidators, registerValidators } = require('../validators/auth.validators');

const router = express.Router();

router.post('/register', registerValidators, validateRequest, authController.register);
router.post('/login', loginValidators, validateRequest, authController.login);

module.exports = router;

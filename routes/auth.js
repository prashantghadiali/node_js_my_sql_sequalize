const express = require('express');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const validate = require('../validators/validate');
const authController = require('../controllers/authController');
const userController = require("../controllers/userController");
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Registration route
router.post('/admin/register', registerValidation, validate, authController.adminRegister);

router.post('/user/register', registerValidation, validate, userController.userRegister);


// Login route
router.post('/admin/login', loginValidation, validate, authController.adminLogin);

router.post('/user/login', loginValidation, validate, userController.userLogin);

// Logout route
router.post('/logout',authenticateToken, authController.logout)

module.exports = router;

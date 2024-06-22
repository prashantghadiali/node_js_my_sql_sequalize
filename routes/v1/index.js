const express = require('express');
const validate = require('../../validators/validate');
const upload = require('../../middlewares/upload'); 
const UserController = require("../../controllers/userController")
const exportController = require("../../controllers/exportController");
const validateIdParam = require('../../validators/uservalidator');
const supplierController = require('../../controllers/supplierController');
const supplierValidator = require('../../validators/supplierValidator');
const customerValidator = require("../../validators/customerValidator")
const customerController = require("../../controllers/customerController")
const { authorizeRole } = require('../../middlewares/authRole');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(`Hello ${req.user.email}, this is a protected route!`);
});

// uploads
router.post('/upload', upload.single('file'), UserController.uploadFile);

// export
router.get('/users/export', exportController.exportUsers);

// delete - we are updating
router.post('/users/:id/status', validateIdParam.id, validate, UserController.updateUserStatus);

// get all active users
router.get('/users/all', UserController.getActiveUsers);

// get single user
router.get('/users/:id',validateIdParam.id, validate, UserController.getActiveUserById);

// update user
router.post('/users/update/:id',validateIdParam.id, validate, UserController.updateUser);

// route to disable (deactivate) a user account by admin
router.put('/users/:id/disable', validateIdParam.id, validate, UserController.disableUser)

// route to enable (reactivate) a user account by admin
router.put('/users/:userId/enable', validateIdParam.id, validate, UserController.enableUser);


// attach role to user
router.post('/users/roles/attach/:id',validateIdParam.roleId, validate,  UserController.attachRoleToUser);
// Detach role from user
router.post('/users/roles/detach/:id',validateIdParam.roleId, validate,  UserController.detachRoleFromUser);

// Making with other method CRUDs
//  Supplier CRUD //
router.post('/suppliers/create', supplierValidator.createSupplierValidator, validate, authorizeRole('admin'), supplierController.createSupplier);
router.get('/suppliers/getall',  authorizeRole(['admin', 'suppliers']), supplierController.getAllSuppliers);
router.get('/suppliers/:id', validateIdParam.id, authorizeRole(['admin', 'suppliers']), supplierController.getSupplierById);
router.put('/suppliers/update/:id',validateIdParam.id, validate,  authorizeRole('admin'), supplierController.updateSupplier);
router.delete('/suppliers/delete/:id', validateIdParam.id, validate, authorizeRole('admin'), supplierController.deleteSupplier);

// Customer Crud
router.post('/customer/create', customerValidator.createCustomerValidator, validate, authorizeRole('admin'), customerController.createCustomer);
router.get('/customer/getall',  authorizeRole(['admin', 'suppliers']), customerController.getAllCustomers);
router.put('/customer/update/:id',validateIdParam.id, validate,  authorizeRole('admin'), customerController.updateCustomer);
router.delete('/customer/delete/:id', validateIdParam.id, validate, authorizeRole('admin'), customerController.deleteCustomer);
  
module.exports = router;
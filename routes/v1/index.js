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

/**
 * @swagger
 * /api/users/export:
 *   get:
 *     tags:
 *       - Export
 *     description: Export users in CSV, Excel, or PDF format
 *     parameters:
 *       - name: format
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, excel, pdf]
 *         description: The format in which to export the users
 *     responses:
 *       '200':
 *         description: Successfully exported users in the specified format
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       '400':
 *         description: Unsupported format or missing query parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
// export
router.get('/users/export', exportController.exportUsers);

/**
 * @swagger
 * /v1/users/{id}/status:
 *   post:
 *     tags:
 *       - User
 *     description: Update user status
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the user
 *     responses:
 *       '200':
 *         description: User status updated successfully
 */


// delete - we are updating
router.post('/users/:id/status', validateIdParam.id, validate, UserController.updateUserStatus);

/**
 * @swagger
 * /v1/users/all:
 *   get:
 *     tags:
 *       - User
 *     description: Get all active users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved all active users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 */
// get all active users
router.get('/users/all', UserController.getActiveUsers);

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     tags:
 *       - User
 *     description: Get a single user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */

// get single user
router.get('/users/:id',validateIdParam.id, validate, UserController.getActiveUserById);

/**
 * @swagger
 * /v1/users/update/{id}:
 *   post:
 *     tags:
 *       - User
 *     description: Update user information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 */

// update user
router.post('/users/update/:id',validateIdParam.id, validate, UserController.updateUser);

/**
 * @swagger
 * /v1/users/{id}/disable:
 *   put:
 *     tags:
 *       - User
 *     description: Disable a user account by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to disable
 *     responses:
 *       '200':
 *         description: User account disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DisableUserResponse'
 */

// route to disable (deactivate) a user account by admin
router.put('/users/:id/disable', validateIdParam.id, validate, UserController.disableUser)

/**
 * @swagger
 * /v1/users/{userId}/enable:
 *   put:
 *     tags:
 *       - User
 *     description: Enable a user account by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to enable
 *     responses:
 *       '200':
 *         description: User account enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnableUserResponse'
 */

// route to enable (reactivate) a user account by admin
router.put('/users/:userId/enable', validateIdParam.id, validate, UserController.enableUser);

/**
 * @swagger
 * /v1/users/roles/attach/{id}:
 *   post:
 *     tags:
 *       - User
 *     description: Attach a role to a user by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to attach the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *                 description: ID of the role to attach
 *     responses:
 *       '200':
 *         description: Role attached to user successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttachRoleResponse'
 */

// attach role to user
router.post('/users/roles/attach/:id',validateIdParam.roleId, validate,  UserController.attachRoleToUser);

/**
 * @swagger
 * /v1/users/roles/detach/{id}:
 *   post:
 *     tags:
 *       - User
 *     description: Detach a role from a user by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to detach the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *                 description: ID of the role to detach
 *     responses:
 *       '200':
 *         description: Role detached from user successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetachRoleResponse'
 */

// Detach role from user
router.post('/users/roles/detach/:id',validateIdParam.roleId, validate,  UserController.detachRoleFromUser);

// Making with other method CRUDs
//  Supplier CRUD //
router.post('/suppliers/create', supplierValidator.createSupplierValidator, validate, authorizeRole('admin'), supplierController.createSupplier);
router.get('/suppliers/getall',  authorizeRole(['admin', 'suppliers']), supplierController.getAllSuppliers);
router.get('/suppliers/:id', validateIdParam.id, authorizeRole(['admin', 'suppliers']), supplierController.getSupplierById);
router.put('/suppliers/update/:id',validateIdParam.id, validate,  authorizeRole('admin'), supplierController.updateSupplier);
router.delete('/suppliers/delete/:id', validateIdParam.id, validate, authorizeRole('admin'), supplierController.deleteSupplier);

/**
 * @swagger
 * /v1/suppliers/create:
 *   post:
 *     tags:
 *       - Supplier
 *     summary: Create a new supplier
 *     description: Endpoint to create a new supplier
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the supplier (required)
 *               mobileNumber:
 *                 type: string
 *                 description: Mobile number of the supplier (required, numeric)
 *               products:
 *                 type: string
 *                 items:
 *                   type: string
 *                 description: products supplied by the supplier
 *     responses:
 *       '200':
 *         description: Successfully created supplier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierResponse'
 *       '400':
 *         description: Validation error or missing fields
 */

/**
 * @swagger
 * /v1/suppliers/getall:
 *   get:
 *     tags:
 *       - Supplier
 *     summary: Get all suppliers
 *     description: Endpoint to retrieve all suppliers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupplierResponse'
 */

/**
 * @swagger
 * /v1/suppliers/{id}:
 *   get:
 *     tags:
 *       - Supplier
 *     summary: Get a supplier by ID
 *     description: Endpoint to retrieve a supplier by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the supplier to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved supplier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierResponse'
 *       '404':
 *         description: Supplier not found
 */

/**
 * @swagger
 * /v1/suppliers/update/{id}:
 *   put:
 *     tags:
 *       - Supplier
 *     summary: Update a supplier by ID
 *     description: Endpoint to update a supplier by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the supplier to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSupplierRequest'
 *     responses:
 *       '200':
 *         description: Successfully updated supplier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierResponse'
 *       '404':
 *         description: Supplier not found
 */
/**
 * @swagger
 * /v1/suppliers/delete/{id}:
 *   delete:
 *     tags:
 *       - Supplier
 *     summary: Delete a supplier by ID
 *     description: Endpoint to delete a supplier by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the supplier to delete
 *     responses:
 *       '204':
 *         description: Successfully deleted supplier
 *       '404':
 *         description: Supplier not found
 */


// Customer Crud
router.post('/customer/create', customerValidator.createCustomerValidator, validate, authorizeRole('admin'), customerController.createCustomer);
router.get('/customer/getall',  authorizeRole(['admin', 'suppliers']), customerController.getAllCustomers);
router.put('/customer/update/:id',validateIdParam.id, validate,  authorizeRole('admin'), customerController.updateCustomer);
router.delete('/customer/delete/:id', validateIdParam.id, validate, authorizeRole('admin'), customerController.deleteCustomer);

/**
 * @swagger
 * /v1/customer/create:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Create a new customer
 *     description: Endpoint to create a new customer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the customer (required)
 *               mobileNumber:
 *                 type: string
 *                 description: Mobile number of the customer (required, numeric)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the customer (required, valid email format)
 *     responses:
 *       '200':
 *         description: Successfully created customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 *       '400':
 *         description: Validation error or missing fields
 */

/**
 * @swagger
 * /v1/customer/getall:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get all customers
 *     description: Endpoint to retrieve all customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '403':
 *         $ref: '#/components/responses/ForbiddenError'
 */
/**
 * @swagger
 * /v1/customer/update/{id}:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update a customer
 *     description: Endpoint to update a customer by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to update
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerUpdateRequest'
 *     responses:
 *       '200':
 *         description: Successfully updated customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       '400':
 *         description: Invalid request or missing fields
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '403':
 *         $ref: '#/components/responses/ForbiddenError'
 */
/**
 * @swagger
 * /v1/customer/delete/{id}:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: Delete a customer
 *     description: Endpoint to delete a customer by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to delete
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       '204':
 *         description: Customer successfully deleted
 *       '400':
 *         description: Invalid request or missing fields
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '403':
 *         $ref: '#/components/responses/ForbiddenError'
 */

module.exports = router;
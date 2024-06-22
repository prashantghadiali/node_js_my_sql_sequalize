const { Customer } = require('../models');
const { InternalErrorResponse, SuccessMsgResponse, BadRequestResponse } = require('../utils/apiResponse');


exports.createCustomer = async (req, res) => {
    try {
        const { name, mobileNumber, email  } = req.body;
        const roleID = 4
        const existingUser = await Customer.findOne({ where: { mobileNumber } });

        if (existingUser) {
            return new InternalErrorResponse('mobile Number is already in use').send(res);
        }

        await Customer.create({
            name,
            mobileNumber,
            email,
            roleId:roleID  //creting Customers
        });
        return new SuccessMsgResponse("Customer Created successfully").send(res)
    } catch (error) {
        console.error(error);
        return new InternalErrorResponse('Failed to create Customer').send(res);
    }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
      const customers = await Customer.findAll();
  
      res.json({ customers });
    } catch (error) {
      console.error(error);
      return new InternalErrorResponse('Failed to fetch Customer').send(res);
    }
  };

exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, mobileNumber, email } = req.body;
  
    try {
      // Find the customer by ID
      const customer = await Customer.findByPk(id);
  
      if (!customer) {
        return new BadRequestResponse('Customer not found').send(res);
      }
  
      // Update the customer's details
      customer.name = name;
      customer.mobileNumber = mobileNumber;
      customer.email = email;
  
      await customer.save();
  
      res.json({ message: 'Customer updated successfully', customer });
    } catch (error) {
      console.error(error);
      return new InternalErrorResponse('Failed to update Customer').send(res);
    }
  };

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
  
    try {
      const customer = await Customer.findByPk(id);
  
      if (!customer) {
        return new BadRequestResponse('Customer not found').send(res);
      }
  
      // Delete the customer
      await customer.destroy();
  
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error(error);
      return new InternalErrorResponse('Failed to delete Customer').send(res);
    }
  };
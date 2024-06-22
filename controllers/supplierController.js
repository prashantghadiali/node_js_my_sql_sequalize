const { Supplier } = require('../models');
const { InternalErrorResponse, SuccessMsgResponse, BadRequestResponse } = require('../utils/apiResponse');

// Create a new Supplier
exports.createSupplier = async (req, res) => {
    try {
        const { name, mobileNumber, products } = req.body;
        const roleID = 3
        const existingUser = await Supplier.findOne({ where: { mobileNumber } });

        if (existingUser) {
            return new InternalErrorResponse('mobile Number is already in use').send(res);
        }

        await Supplier.create({
            name,
            mobileNumber,
            products,
            roleId:roleID  //creting suppliers
        });
        return new SuccessMsgResponse("Supplier Created successfully").send(res)
    } catch (error) {
        console.error(error);
        return new InternalErrorResponse('Failed to create supplier').send(res);
    }
};

// Get all Suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        return new InternalErrorResponse('Failed to fetch supplier').send(res);
    }
};

// Get Supplier by ID
exports.getSupplierById = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return new BadRequestResponse('Supplier not found').send(res)
        }
        res.json(supplier);
    } catch (error) {
        console.error(error);
        return new InternalErrorResponse('Failed to fetch supplier').send(res)
    }
};

// Update Supplier by ID
exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, mobileNumber, products } = req.body;

    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return new BadRequestResponse('Supplier not found').send(res)
        }

        supplier.name = name;
        supplier.mobileNumber = mobileNumber;
        supplier.products = products;

        await supplier.save();

        res.json(supplier);
    } catch (error) {
        console.error(error);
        return new InternalErrorResponse('Failed to update supplier').send(res)
    }
};

// Delete Supplier by ID
exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return new BadRequestResponse('Supplier not found').send(res)
        }

        await supplier.destroy();
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error(error);
        return new InternalErrorResponse('Failed to delete supplier').send(res);
    }
};

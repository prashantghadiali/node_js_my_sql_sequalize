'use strict';
const { hashPassword } = require('../utils/auth');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await hashPassword('password123');
    return queryInterface.bulkInsert('Users', [{
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      contactNumber: '1234567890',
      postcode: '12345',
      password: hashedPassword,
      hobbies: 'reading,swimming',
      gender: 'male',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com',
      contactNumber: '0987654321',
      postcode: '54321',
      password: hashedPassword,
      hobbies: 'cooking,running',
      gender: 'female',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

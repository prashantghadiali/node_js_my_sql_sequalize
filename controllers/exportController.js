const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { User } = require('../models'); 
const { InternalErrorResponse, BadRequestResponse } = require('../utils/apiResponse');
const { createObjectCsvWriter } = require('csv-writer');

const exportUsers = async (req, res) => {
  const format = req.query.format;

  try {
    // Fetch users from the database
    const users = await User.findAll();

    // Export user data based on format
    switch (format) {
      case 'csv':
        exportCSV(users, res);
        break;
      case 'excel':
        exportExcel(users, res);
        break;
      case 'pdf':
        exportPDF(users, res);
        break;
      default:
        return new BadRequestResponse("Unsupported Format").send(res)
    }
  } catch (error) {
    console.error('Error exporting users:', error);
    return new InternalErrorResponse("Error exporting users").send(res)
  }
};

const exportCSV = (users, res) => {
  const csvWriter = createObjectCsvWriter({
    path: 'users.csv',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'firstname', title: 'First Name' },
      { id: 'lastname', title: 'Last Name' },
      { id: 'email', title: 'Email' },
      { id: 'contactNumber', title: 'Contact Number' },
      { id: 'postcode', title: 'Postcode' },
      { id: 'hobbies', title: 'Hobbies' },
      { id: 'gender', title: 'Gender' },
      { id: 'createdAt', title: 'Created At' },
      { id: 'updatedAt', title: 'Updated At' },
    ],
  });

  csvWriter.writeRecords(users.map(user => ({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    contactNumber: user.contactNumber,
    postcode: user.postcode,
    hobbies: user.hobbies,
    gender: user.gender,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })))
    .then(() => {
      res.download('users.csv');
    })
    .catch((err) => {
      console.error('Error writing CSV:', err);
      return new InternalErrorResponse("Error exporting CSV").send(res)
    });
};

const exportExcel = (users, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'First Name', key: 'firstname', width: 20 },
    { header: 'Last Name', key: 'lastname', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Contact Number', key: 'contactNumber', width: 15 },
    { header: 'Postcode', key: 'postcode', width: 15 },
    { header: 'Hobbies', key: 'hobbies', width: 30 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Updated At', key: 'updatedAt', width: 20 },
  ];

  users.forEach((user) => {
    worksheet.addRow({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      contactNumber: user.contactNumber,
      postcode: user.postcode,
      hobbies: user.hobbies,
      gender: user.gender,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  });

  workbook.xlsx.writeBuffer()
    .then((buffer) => {
      res.set({
        'Content-Disposition': 'attachment; filename=users.xlsx',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      res.send(buffer);
    })
    .catch((err) => {
      console.error('Error writing Excel:', err);
      return new InternalErrorResponse("Error exporting Excel").send(res)
    });
};

const exportPDF = (users, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');

  doc.pipe(res);

  doc.fontSize(12);
  doc.text('Exported Users', { align: 'center' });
  doc.moveDown();

  users.forEach((user) => {
    doc.text(`ID: ${user.id}`);
    doc.text(`Name: ${user.firstname} ${user.lastname}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Contact Number: ${user.contactNumber}`);
    doc.text(`Postcode: ${user.postcode}`);
    doc.text(`Hobbies: ${user.hobbies}`);
    doc.text(`Gender: ${user.gender}`);
    doc.text(`Created At: ${user.createdAt.toISOString()}`); 
    doc.text(`Updated At: ${user.updatedAt.toISOString()}`); 
    doc.moveDown();
  });

  doc.end();
};

module.exports = { exportUsers };

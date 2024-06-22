const Sequelize = require("sequelize");
const config = require("./config");

const env = process.env.NODE_ENV;
const { database, username, password, host, dialect } = config[env];

console.log(`You are working on : ${env} environment`);

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect
});

module.exports = sequelize;
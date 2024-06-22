module.exports = {
    "development": {
      "username": `${process.env.DEV_MYSQL_USERNAME}`,
      "password": `${process.env.TEST_MYSQL_PASSWORD}`,
      "database": "great_approach",
      "host": `${process.env.DEV_MYSQL_HOST}`,
      "port": 3306,
      "dialect": "mysql"
    },
    "test": {
      "username": `${process.env.TEST_MYSQL_USERNAME}`,
      "password": `${process.env.TEST_MYSQL_PASSWORD}`,
      "database": "great_approach_test",
      "host": `${process.env.TEST_MYSQL_HOST}`,
      "port": 3306,
      "dialect": "mysql"
    },
    "production": {
      "username": `${process.env.PROD_MYSQL_USERNAME}`,
      "password": `${process.env.TEST_MYSQL_PASSWORD}`,
      "database": "great_approach_prod",
      "host": `${process.env.PROD_MYSQL_HOST}`,
      "port": 3306,
      "dialect": "mysql"
    }
  }

  
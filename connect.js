const mysql = require("mysql2/promise");
const { dbConfig } = require("./config");

const DatabaseConnect = {
  connect: mysql.createPool(dbConfig)
};

module.exports = DatabaseConnect;

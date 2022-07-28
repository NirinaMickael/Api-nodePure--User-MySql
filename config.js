const config = {
  PORT_SERVER: 3002,
};
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTION",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json",
};
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Nirina1234",
  database: "UserAdmin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
module.exports = { config, headers,dbConfig};

const fs = require('fs')
const mysql = require('mysql');


const options = SQLoptions = {
 // connectionLimit : 1000,
 // connectTimeout  : 60 * 60 * 1000,
//  acquireTimeout  : 60 * 60 * 1000,
 // timeout         : 60 * 60 * 1000,
	host: process.env.m_host,
	port: process.env.m_port,
	user: process.env.m_user,
	password: process.env.m_password,
	database: process.env.m_database,
  charset : 'latin1'
  // ssl  : {
     // ca : fs.readFileSync(__dirname + '/mysqlCerts/ca.pem'),
     // key : fs.readFileSync(__dirname + '/mysqlCerts/client-key.pem'),
     // cert : fs.readFileSync(__dirname + '/mysqlCerts/client-cert.pem')
   // }
};

connection = mysql.createPool(options)


module.exports = {
    connection,
    options
}

// database credentials 
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '[database host info]',
  user            : '[username]',
  password        : '[password]',
  database        : 'database name'
});

module.exports.pool = pool;

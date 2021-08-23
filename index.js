// Fitness To Do
// Routes, server and mySQL queries

// express, sql and cors middleware
var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 8489);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

// mySQL queries
const getALLQuery = 'SELECT * FROM workout';
const insertQuery = "INSERT INTO workout (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?, ?, ?, ?, ?)";
const updateQuery = "UPDATE workout SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=? ";
const deleteQuery = "DELETE FROM workout WHERE id=?";

// function that returns all the data from the database as json
function returnData(res){
  // selecting all elements in database
  mysql.pool.query(getALLQuery, (err, rows, fields) => {
    if (err) {
      next(err);
      return;
    }
    // sending the json 
    res.json({"rows": rows}); 
  });
};

// GET request handling, used when page is refreshed
app.get('/',function(req,res,next){
  mysql.pool.query(getALLQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    // sending all the data back
    returnData(res);
  });
});

// post requests to handle new additions to database
app.post('/',(req,res,next) => {
  var {name, reps, weight, unit, date} = req.body;
  // adding new row to query
  mysql.pool.query(insertQuery, [name, reps, weight, unit, date], (err, result) => {
    if(err){
      next(err);
      return;
    }
    // sending all the data back
    returnData(res);
  });
});

// Delete requests to handle deletion of database input
app.delete('/', (req,res,next) => {
  var {id} = req.body
  // deleting row from query
  mysql.pool.query(deleteQuery, [id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    returnData(res);
  });
});

// PUT request to handle edits to the database
app.put('/', (req,res,next) => {
  var {name, reps, weight, unit, date, id} = req.body;
  // editing row in query
  mysql.pool.query(updateQuery, [name, reps, weight, unit, date, id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    returnData(res);
  });
});

// GET request to reset the table
app.get('/reset-table',(req,res,next) => {
  // deleting current table
  mysql.pool.query("DROP TABLE IF EXISTS workout", (err) => {
    // creating string to make new table
    var createData = "CREATE TABLE workout("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "unit BOOLEAN,"+
    "date DATE)";
    // creating new table
    mysql.pool.query(createData, (err) => {
    res.send("New Table Created")
    })
  });
});

// 400 error handler
app.use((req,res) => {
  res.status(404);
  res.send('404');
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

// url for AJAX requests
app.listen(app.get('port'),() => {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

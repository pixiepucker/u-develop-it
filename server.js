const mysql = require('mysql2');
const express = require('express');
const { contentType } = require('express/lib/response');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'election'
    },
    console.log('Connected to the election database.')
);

//candidates table information
// db.query(`SELECT * FROM candidates`, (err,rows) => {
//     console.log(rows);
// });

//single candidate statement
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

//delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err,result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

//create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
            VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err,result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

//2nd to LAST: catchall response for any other request (NOT FOUND)
app.get((req,res) => {
    res.status(404).end();
});

//LAST: start server on 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
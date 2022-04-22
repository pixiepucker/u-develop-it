const mysql = require('mysql2');
const express = require('express');

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

//2nd to LAST: default response for any other request (NOT FOUND)
app.get((req,res) => {
    res.status(404).end();
});

//LAST: start server on 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const mysql = require('mysql2');
const express = require('express');
const { contentType } = require('express/lib/response');
const inputCheck = require('./utils/inputCheck');
const { application } = require('express');

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
app.get('/api/candidates',(req,res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`;

    db.query(sql, (err,rows) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


//single candidate statement
app.get('/api/candidate/:id', (req,res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});


//delete a candidate
app.delete('/api/candidate/:id', (req,res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,result) => {
        if (err) {
            res.statusMessage(400).json({
                error: res.message
            });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'delete successful',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({
            error: errors
        });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ 
          error: err.message 
        });
      return;
    }
    res.json({
      message: 'insertion successful',
      data: body
    });
  });
});

//get all parties
app.get('/api/parties', (req,res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
        res.status(500).json({
            error: err.message
        });
        return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//get single party
app.get('/api/party/:id', (req,res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql,params, (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//delete a party
app.delete('/api/party/:id', (req,res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: res.message
            });
            //checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'Deletion successful',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//update candidate's party
app.put('/api/candidate/:id', (req,res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return
    }
    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql,params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            //check if record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'Update successful',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

//2nd to LAST: catchall response for any other request (NOT FOUND)
app.get((req,res) => {
    res.status(404).end();
});

//LAST: start server on 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
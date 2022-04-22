const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//2nd to LAST: default response for any other request (NOT FOUND)
app.get((req,res) => {
    res.status(404).end();
});

//LAST: start server on 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
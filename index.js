// Add required packages
const express = require("express");
const app = express();

// Use Multer
const multer = require("multer");
const upload = multer();

require('dotenv').config();

// Set up EJS
app.set("view engine", "ejs");

// Add database package and connection string (can remove ssl)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL=DATABASE_URL="postgres://vpypdmquvgfmga:4380fae0d1c27e0c01835b5e6652c59e6780adc9d2744d7932a02ef2ad9e7643@ec2-52-3-200-138.compute-1.amazonaws.com:5432/dcqusohejdpki4",
  ssl: {
    rejectUnauthorized: false
  }
});

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Set up routes 
app.get("/", (req, res) => {
    //res.send ("Hello world...");
    const sql = "SELECT * FROM PRODUCT ORDER BY PROD_ID";
    pool.query(sql, [], (err, result) => { //[] - the values you input into SQL statement.
        var message = "";
        var model = {};
        if(err) {
            message = `Error - ${err.message}`;
        } else {
            message = "success";
            model = result.rows; // Gives you back all the rows in the query
        };
        res.render("index", {
            message: message, // Pas it the message
            model : model // Pass the records that came back
        });
    });
});

app.get("/input", (req, res) => {
    res.render("input");
 });
 
 app.post("/input",  upload.single('filename'), (req, res) => {
     if(!req.file || Object.keys(req.file).length === 0) {
         message = "Error: Import file not uploaded";
         return res.send(message);
     };
     //Read file line by line, inserting records
     const buffer = req.file.buffer; 
     const lines = buffer.toString().split(/\r?\n/);
 
     lines.forEach(line => {
          //console.log(line);
          product = line.split(",");
          //console.log(product);
          const sql = "INSERT INTO PRODUCT(prod_id, prod_name, prod_desc, prod_price) VALUES ($1, $2, $3, $4)";
          pool.query(sql, product, (err, result) => {
              if (err) {
                  console.log(`Insert Error.  Error message: ${err.message}`);
              } else {
                  console.log(`Inserted successfully`);
              }
         });
     });
     message = `Processing Complete - Processed ${lines.length} records`;
     res.send(message);
 });

// Setup routes
// app.get("/", (req, res) => {
//     //res.send ("Hello world...");
//     res.render("index");
// });


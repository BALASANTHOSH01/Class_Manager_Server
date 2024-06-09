const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
});

db.connect((err)=>{
    if(err){
        console.log("Error in connection "+err);
        return;
    }
    console.log("MYSQL connected");
});

module.exports = db;
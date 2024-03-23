const Mysql = require("mysql2");
require("dotenv").config();

const mysql = Mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

mysql.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`Database connected`);
    }
});

module.exports = mysql;

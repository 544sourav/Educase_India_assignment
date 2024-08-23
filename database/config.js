const mysql = require("mysql2/promise")
require("dotenv").config()

const HOST=process.env.MYSQL_ADDON_HOST
const USER = process.env.MYSQL_ADDON_USER
const PASSWORD = process.env.MYSQL_ADDON_PASSWORD
const DB = process.env.MYSQL_ADDON_DB

const mySqlPool = mysql.createPool({
    host:HOST,
    user:USER,
    password:PASSWORD,
    database:DB
})
module.exports = mySqlPool
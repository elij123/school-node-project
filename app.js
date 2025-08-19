import express from "express";
import mysql from "mysql2/promise"

const app = express()
const port = 3000

try {
    const connection = await mysql.createConnection({
    host: 'mysql-k8al',
    port: 3306,
    user: 'elijah',
    password: process.env.DB_PASSWORD,
    database: ''
  });
  const sql = 'SELECT `id`,`latitude`,`longitude` FROM `school_list`'
  const [rows, fields] = await connection.query(sql);
  console.log(rows);
  console.log(fields);
} catch (error) {
    console.log(error);
}

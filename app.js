import express from "express";
import mysql from "mysql"

const app = express()

const port = 3000

const connection = mysql.createConnection({
    host: "localhost",
    user: "elijah",
    password: $DB_PASSWORD,
    database: "school"
})

connection.connect()

const test = (loc1,loc2) => 34

app.get("/listSchools",(req,res) =>{
    // const latitude = req.body.latitude
    // const longitude = req.body.longtitude
    connection.query("SELECT id,latitude,longitude FROM school_list", function (error, results, fields){
        console.log(results)
    })
    // Fetch the list from the MySQL DB and calculate
    // the distance along with map() and sort it
    // in ascending order using sort(callback)
    // const list = ["test"]
    // res.send(list)
})

// app.post("/addSchool",(req,res) => {
//     //Validates values from the request

//     //Adds a row to the relational table 'Schools'
// })

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

connection.end()
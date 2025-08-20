import express from "express"
import mysql from "mysql2/promise"
import Joi from "joi"

let connection = null

const schema = Joi.object({
    name: Joi.string()
    .pattern(new RegExp("^[a-zA-Z\. ]*$"))
    .required(),

    address: Joi.string()
    .alphanum()
    .required(),

    latitude: Joi.number()
    .precision(2),

    longitude: Joi.number()
    .precision(2)
})
.with("name",["address","latitude","longitude"])

const app = express()
const port = process.env.PORT || 4000

app.use(express.urlencoded())

const calculate_distance = (lat1,long1,lat2,long2) => {
    const R = 6371e3
    const phi1 = lat1 * (Math.PI/180)
    const phi2 = lat2 * (Math.PI/180)
    const delta_phi = phi2-phi1
    const delta_lambda = (long2-long1) * (Math.PI/180)

    const a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) + 
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2)

    const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

    const d = R * c

    return (d/1000).toFixed(2)
}

try {
    connection = await mysql.createConnection({
    host: 'mysql-k8al',
    port: 3306,
    user: 'elijah',
    password: process.env.DB_PASSWORD,
    database: 'school'
    });
} 
catch (error) {
    console.log(error);
}

app.get("/listSchools", async (req,res) => {
    const user_lat= req.query.latitude
    const user_long = req.query.longitude
    const sql = 'SELECT `name`,`address`,`latitude`,`longitude` FROM `school_list`'
    const [rows] = await connection.query(sql);
    const distance_list = rows.map((obj) => {
        return {
            name:obj.name,
            address:obj.address,
            distance_km:calculate_distance(user_lat,user_long,obj.latitude,obj.longitude)
        }})
    distance_list.sort((dist1,dist2) => dist1.distance_km-dist2.distance_km)
    res.send(distance_list)
})

app.post("/addSchool", async (req,res) => {
    try {
        await schema.validateAsync({
        name: req.body.name,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    })
    } catch (error) {
        res.sendStatus(400)
    }
    const sql_insert = 'INSERT INTO `school_list` (`name`,`address`,`latitude`,`longitude`) VALUES (?, ?, ?, ?)'
    const sql_values = [req.body.name,req.body.address,req.body.latitude,req.body.longitude]
    try {
        const [result] = await connection.execute(sql_insert, sql_values);
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.listen(port, () => {
        console.log(`Listening at port ${port}`)
    })

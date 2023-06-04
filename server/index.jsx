const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    port: '3307',
    user: "root",
    password: "123",
    database: "despesas",
});

// CREATE
app.post("/expense", (req, res) => {
    
    const { expense, amount } = req.body;

    let SQL = "INSERT INTO listadespesas ( items, amount ) VALUES (?, ?)";

    const values = [expense, amount];
    
    db.query(SQL, values, (err, result) => {
        console.log(err);
    })
});

// READ
app.get("/expense", (req, res) => {

    let SQL = "SELECT * from listadespesas";
    
    db.query(SQL, (err, result) => {
        if(err) console.log(err);
        else res.send(result);
    })
});

// DELETE
app.delete("/expense/:id", (req, res) => {
    
    const { id } = req.params;
    console.log("Informação: ", id)

    let SQL = "DELETE FROM listadespesas WHERE (`id` = ? )";
    
    db.query(SQL, id, (err, result) => {
        console.log(err);
    })
});

app.listen(3001, () => {
    console.log("Server running!")
});
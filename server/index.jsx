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
        res.sendStatus(201);
    })
});

// READ
app.get("/expense", (req, res) => {

    let SQL = "SELECT * from listadespesas";
    
    db.query(SQL, (err, result) => {
        if(err) console.log(err);
        else res.send(result).status(200);
    })
});

// UPDATE

app.put("/expense/:id", (req, res) => {
    
    const { id } = req.params;
    const { amount } = req.body;

    let SQL = "UPDATE listadespesas SET items = ?, amount = ? WHERE (`id` = ?);"

    db.query(SQL, amount, id, (err, result) => {
        if(err) console.log(err);
        else res.send(result).status(200);
    })
});

// DELETE
app.delete("/expense/:id", (req, res) => {
    
    const { id } = req.params;

    let SQL = "DELETE FROM listadespesas WHERE (`id` = ? )";
    
    db.query(SQL, id, (err, result) => {
        console.log(err);
        res.sendStatus(204);
    })
});

app.listen(3001, () => {
    console.log("Server running!")
});
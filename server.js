const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up the database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        doctor TEXT,
        date TEXT,
        time TEXT
    )`);
});

// Endpoint to handle form submission
app.post('/api/appointments', (req, res) => {
    const { name, email, phone, doctor, date, time } = req.body;
    db.run(`INSERT INTO appointments (name, email, phone, doctor, date, time) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone, doctor, date, time], function(err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.status(200).send('Appointment booked successfully');
        });
});

// Endpoint to get all appointments (for testing purposes)
app.get('/api/appointments', (req, res) => {
    db.all(`SELECT * FROM appointments`, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

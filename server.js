const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    fs.readFile('./db/db.json', (error, data) => res.json(JSON.parse(data)));
});


app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req.body);
    fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
        } else {
            const parsedNotes = JSON.parse(data);
            req.body.id = uuid();
            parsedNotes.push(req.body)
            fs.writeFile(`./db/db.json`, 
            JSON.stringify(parsedNotes), 
            (writeErr) => writeErr ? console.error(err) : res.json(parsedNotes))
        }
        console.log(`Note has been written to JSON file`)
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
        } else {
            const parsedNotes = JSON.parse(data);
            const newNotes = [];
            for (let i = 0; i < parsedNotes.length; i++) {
                if (parsedNotes[i].id != req.params.id)
                newNotes.push(parsedNotes[i])
            }
            fs.writeFile(`./db/db.json`, JSON.stringify(newNotes),
            (writeErr) => writeErr ? console.error(err) : res.json(newNotes)
            )
        }
    });
});
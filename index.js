var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/user', function (req, res) {

    var names = req.body.names;
    var lastnames = req.body.lastnames;
    var country = req.body.country;
    var city = req.body.city;
    var email = req.body.email;
    var interests = req.body.interests;
    var password = req.body.password;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }
        // SQL Query > Insert Data
        client.query('INSERT INTO public.user (names, lastnames, country, city, email, interests, password) VALUES ($1, $2, $3, $4, $5, $6, $7)', [names, lastnames, country, city, email, interests, password]);

        res.send("Usuario Agregado!");
    });


});


app.post('/user/login', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    var results = [];

    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM user WHERE email=$1 AND password=$2;', [email, password]);
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            if (results.length == 0) {
                return res.status(403).json({
                    success: false,
                    data: err
                });
            } else {
                res.send('867ty23ehd8');
            }
        });
    });


});

app.get('/categories', function (req, res) {

    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM categories ORDER BY id ASC;');
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            res.send(results);
        });
    });

});



app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
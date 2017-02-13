var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/user', function (req, res) {

    /*
    • Nombres y apellidos
• Foto
• País de origen
• Ciudad
• Correo electrónico
• Y un texto donde explica su interés por la reserve.
    */
    var names = req.body.names;
    var lastnames = req.body.lastnames;
    var country = req.body.country;
    var city = req.body.city;
    var email = req.body.email;
    var interest = req.body.interest;

    res.send(names + ", " + lastnames);
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
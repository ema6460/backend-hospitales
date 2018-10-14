// REQUIRES
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// IMPORTA RUTAS
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');



// Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, rep) => {
    if ( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');


});

// ============= RUTAS =============

//  Declaro un middleware que es algo que se ejecuta antes que se resuelvan otras rutas, cuando cualquier peticion haga match con / quiero que use appRoutes
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);





// Escuchar peticiones
app.listen(3000, () => {

    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');

});
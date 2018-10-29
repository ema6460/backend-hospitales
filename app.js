// REQUIRES
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// IMPORTA RUTAS
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var medicoRoutes = require('./routes/medico');
var hospitalRoutes = require('./routes/hospital');
var pacienteRoutes = require('./routes/paciente');
var uploadRoutes = require('./routes/upload');
var loginRoutes = require('./routes/login');



// Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true
}, (err, rep) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');


});

// ============= RUTAS =============

//  Declaro un middleware que es algo que se ejecuta antes que se resuelvan otras rutas, cuando cualquier peticion haga match con / quiero que use appRoutes
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/upload', uploadRoutes);
app.use('/medico', medicoRoutes);
app.use('/paciente', pacienteRoutes);
app.use('/', appRoutes);





// Escuchar peticiones
app.listen(3000, () => {

    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');

});
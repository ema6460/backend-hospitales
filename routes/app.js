//Importaciones
var express = require('express');
var app = express();


// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({

        ok: true,
        mensaje: 'Peticion realizada con exito',

    })

});

//Exporto archivo para que las rutas se puedan usar fuera de este archivo
module.exports = app;
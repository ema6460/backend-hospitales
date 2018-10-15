var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();



//Importo el esquema de usuario que se encuentra en el model/usuario
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    // Para recibir el correo y la contraseña como parte del cuerpo del login    
    var body = req.body;


    // Saber si existe un usuario con el email
    Usuario.findOne({
        email: body.email
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                body: body
            });
        }


        // Toma el string que se quiere verificar y lo compara con otro que ya a sido pasado por el hash
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                body: body
            });
        }

        // CREA TOKEN
        usuarioDB.password = ':)';

        var token = jwt.sign({
            usuario: usuarioDB
        }, SEED, {
            expiresIn: 14400
        });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    });



});







module.exports = app;
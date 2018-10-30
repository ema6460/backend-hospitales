var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();



//Importo el esquema de usuario que se encuentra en el model/usuario
var Usuario = require('../models/usuario');


var CLIENT_ID = require('../config/config').CLIENT_ID;
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
// ==============================
// Autenticacón de google
// ===============================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
verify().catch(console.error);


app.post('/google', async (req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch( e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        });

    res.status(200).json({
        ok: true,
        mensaje: 'OKK!!!!',
        googleUser: googleUser
    });

});




// ==============================
// Autenticacón normal
// ===============================
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
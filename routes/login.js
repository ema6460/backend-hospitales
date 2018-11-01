var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
 
var SEED = require('../config/config').SEED;
var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
 
var { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(GOOGLE_CLIENT_ID);
 
// Inicializar variables
var app = express();
 
async function verify(token) {
  var ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
  });
 
  var payload = ticket.getPayload();
 
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}
 
// Autenticación vía google
app.post('/google', async (req, res) => {
  var token = req.body.token;
 
  var googleUser = await verify(token).catch(err => {
    return res.status(403).json({
      ok: false,
      mensaje: 'Token de google inválido',
      errors: { message: 'Token de google inválido' }
    });
  });
 
  Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'El usuario no existe',
        errors: err
      });
    }
 
    if (usuario) {
      if (!usuario.google) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Debe usar su autenticación con correo y contraseña'
        });
      } else {
        usuario.password = ':)';
 
        // Expira en 4 horas (14400 ms)
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400});
 
        return res.status(200).json({
          ok: true,
          id: usuario.id,
          usuario: usuario,
          token: token
        });
      }
    } else {
      // El usuario no existe, hay que crearlo
      var nuevoUsuario = new Usuario({
        nombre: googleUser.nombre,
        email: googleUser.email,
        password: ':)',
        img: googleUser.img,
        google: true
      });
 
      nuevoUsuario.save((err, usuarioGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error al crear usuario',
            errors: err
          });
        }
 
        // Expira en 4 horas (14400 ms)
        var token = jwt.sign({ usuario: usuarioGuardado }, SEED, { expiresIn: 14400});
 
        return res.status(200).json({
          ok: true,
          id: usuarioGuardado.id,
          usuario: usuarioGuardado,
          token: token
        });
      });
    }
  });
});
 
// Autenticación normal
app.post('/', (req, res) => {
  var body = req.body;
 
 
  Usuario.findOne({ email: body.email}, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'El usuario no existe',
        errors: err
      });
    }
 
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - email',
        errors: { message: 'Credenciales incorrectas - email' }
      });
    }
 
    if (!bcrypt.compareSync(body.password, usuario.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - password',
        errors: { message: 'Credenciales incorrectas - password' }
      });
    }
 
    usuario.password = ':)';
 
    // Expira en 4 horas (14400 ms)
    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400});
 
    return res.status(200).json({
      ok: true,
      id: usuario.id,
      usuario: usuario,
      token: token
    });
  });
});
 
module.exports = app;
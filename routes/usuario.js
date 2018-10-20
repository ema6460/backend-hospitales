//Importaciones
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middelwares/autenticacion');
var app = express();


//Importo el esquema de usuario que se encuentra en el model/usuario
var Usuario = require('../models/usuario');


// Rutas


// ======================================
// Obtener todos los usuarios
// ======================================
app.get('/', (req, res, next) => {

    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre apellido email img role')

    // Para que se saltee el numero que le asigne a desde y despues cargue n° desde
    .skip(desde)

    // Limit limita la respuesta a la cant de registros que quiero mostrar, en este caso serian 5.
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: err
                    });
                }


                //Cont sirve para saber la cantidad de registros que hay en el esquema
                Usuario.count({}, (err, conteo) => {
                    
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });

            });
});






// ======================================
// Actualizar usuario
// ======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: {
                    message: 'No existe el usuario con ese ID'
                }
            });
        }

        usuario.nombre = body.nombre;
        usuario.apellido = body.apellido;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});




// ======================================
// Crear usuario
// ======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    // Creo el obj de tipo usuario del modelo del esquema de mongoose
    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });
});



// ======================================
// Eliminar un usuario por el id
// ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: {
                    message: 'No existe un usuario con ese id'
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});


//Exporto archivo para que las rutas se puedan usar fuera de este archivo
module.exports = app;
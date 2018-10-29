//Importaciones
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
var Paciente = require('../models/paciente');

app.use(fileUpload());


// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colleccion
    var tipoValidos = ['hospitales', 'medicos', 'usuarios', 'pacientes'];
    if (tipoValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es valida',
            errors: {
                message: 'Tipo de colección no es valida'
            }
        });

    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: {
                message: 'Debe seleccionar una imagen'
            }
        });

    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones son validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: {
                message: 'Las extenciones validas son ' + extensionesValidas.join(', ')
            }
        });
    }


    // Nombre de archivo personalizado
    // 123123123123-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el archivo del temporal a un path en particular
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Eror al mover archivo',
                errors: err

            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({

                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: {
                        message: 'Usuario no existe'
                    }

                });
            }

            // Por si ya existe una imagen, borrar la imagen vieja
            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            // Asignar la imagen nueva
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = '';

                return res.status(200).json({

                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado: usuarioActualizado

                });
            });

        });
    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({

                    ok: false,
                    mensaje: 'medico no existe',
                    errors: {
                        message: 'medico no existe'
                    }

                });
            }

            // Por si ya existe una imagen, borrar la imagen vieja
            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            // Asignar la imagen nueva
            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({

                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medicoActualizado: medicoActualizado

                });
            });

        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({

                    ok: false,
                    mensaje: 'hospital no existe',
                    errors: {
                        message: 'hospital no existe'
                    }

                });
            }
            // Por si ya existe una imagen, borrar la imagen vieja
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            // Asignar la imagen nueva
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({

                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospitalActualizado: hospitalActualizado

                });
            });

        });
    }
    if (tipo === 'pacientes') {

        Paciente.findById(id, (err, paciente) => {

            if (!paciente) {

                return res.status(400).json({

                    ok: false,
                    mensaje: 'paciente no existe',
                    errors: {
                        message: 'paciente no existe'
                    }

                });
            }
            // Por si ya existe una imagen, borrar la imagen vieja
            var pathViejo = './uploads/pacientes/' + paciente.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            // Asignar la imagen nueva
            paciente.img = nombreArchivo;

            paciente.save((err, pacienteActualizado) => {

                return res.status(200).json({

                    ok: true,
                    mensaje: 'Imagen de paciente actualizada',
                    pacienteActualizado: pacienteActualizado

                });
            });

        });
    }
}

//Exporto archivo para que las rutas se puedan usar fuera de este archivo
module.exports = app;
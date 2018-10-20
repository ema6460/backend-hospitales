//Importaciones
var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();


//Importo el esquema de usuario que se encuentra en el model/hospital
var Hospital = require('../models/hospital');


// Rutas


// ======================================
// Obtener todos los hospitales
// ======================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})

        // Para que se saltee el numero que le asigne a desde y despues cargue n° desde
        .skip(desde)

        // Limit limita la respuesta a la cant de registros que quiero mostrar, en este caso serian 5.
        .limit(5)


        // Populate sirve para especificar que tablas o que campos quiero de la otra coleccion
        .populate('usuario', 'nombre apellido email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar hospitales',
                        errors: err
                    });
                }

                //Cont sirve para saber la cantidad de registros que hay en el esquema
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });
            });
});






// ======================================
// Actualizar Hospital
// ======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id' + id + 'no existe',
                errors: {
                    message: 'No existe el hospital con ese ID'
                }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});




// ======================================
// Crear hospital
// ======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    // Creo el obj de tipo usuario del modelo del esquema de mongoose
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            hospitaltoken: req.hospital
        });
    });
});



// ======================================
// Eliminar un hospital por el id
// ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ningun hospital con ese id',
                errors: {
                    message: 'No existe ningun hospital con ese id'
                }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });

});


//Exporto archivo para que las rutas se puedan usar fuera de este archivo
module.exports = app;
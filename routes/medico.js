//Importaciones
var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();


//Importo el esquema de usuario que se encuentra en el model/medico
var Medico = require('../models/medico');


// Rutas


// ======================================
// Obtener todos los medicos
// ======================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})

        // Para que se saltee el numero que le asigne a desde y despues cargue n° desde
        .skip(desde)

        // Limit limita la respuesta a la cant de registros que quiero mostrar, en este caso serian 5.
        .limit(5)
        .populate('usuario', 'nombre apellido email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar medicos',
                        errors: err
                    });
                }

                //Cont sirve para saber la cantidad de registros que hay en el esquema
                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                }); 
            });
});






// ======================================
// Actualizar Medico
// ======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id' + id + 'no existe',
                errors: {
                    message: 'No existe el medico con ese ID'
                }
            });
        }

        medico.nombre = body.nombre;
        medico.apellido = body.apellido;
        medico.usuario = req.usuario._id;
        medico.hospial = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});




// ======================================
// Crear medico
// ======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    // Creo el obj de tipo usuario del modelo del esquema de mongoose
    var medico = new Medico({
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            medicotoken: req.medico
        });
    });
});



// ======================================
// Eliminar un medico por el id
// ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ningun medico con ese id',
                errors: {
                    message: 'No existe ningun medico con ese id'
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});


//Exporto archivo para que las rutas se puedan usar fuera de este archivo
module.exports = app;
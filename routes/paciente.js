//Importaciones
var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();


//Importo el esquema de usuario que se encuentra en el model/paciente
var Paciente = require('../models/paciente');


// Rutas


// ======================================
// Obtener todos los pacientes
// ======================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Paciente.find({})

        // Para que se saltee el numero que le asigne a desde y despues cargue n° desde
        .skip(desde)

        // Limit limita la respuesta a la cant de registros que quiero mostrar, en este caso serian 5.
        .limit(5)
        .populate('usuario', 'nombre apellido email role')
        .populate('hospital')
        .populate('medico')
        .exec(
            (err, pacientes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar paciente',
                        errors: err
                    });
                }

                //Cont sirve para saber la cantidad de registros que hay en el esquema
                Paciente.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        pacientes: pacientes,
                        total: conteo
                    });
                });
            });
});






// ======================================
// Actualizar
// ======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Paciente.findById(id, (err, paciente) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar paciente',
                errors: err
            });
        }

        if (!paciente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El paciente con el id' + id + 'no existe',
                errors: {
                    message: 'No existe el paciente con ese ID'
                }
            });
        }

       paciente.nombre = body.nombre;
       paciente.apellido = body.apellido;
       paciente.usuario = req.usuario._id;
       paciente.dni = req.dni;
       paciente.hospial = body.hospital;
       

        paciente.save((err, pacienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar paciente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                paciente: pacienteGuardado
            });
        });
    });
});




// ======================================
// Crear Paciente
// ======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    // Creo el obj de tipo paciente del modelo del esquema de mongoose
    var paciente = new Paciente({
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        hospital: body.hospital,
        medico: body.medico,
        usuario: req.usuario._id
    });

    paciente.save((err, pacienteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear paciente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            paciente: pacienteGuardado,
           pacientetoken: req.paciente
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
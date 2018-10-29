var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pacienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre	es requerido']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es requerido']
    },
    dni: {
        type: Number,
        required: [true, 'El dni es requerido']
    },
    img: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El id	hospitales un campo obligatorio ']
    },
    medico: {
        type: Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'El id de medico es un campo obligatorio']
    },
});
module.exports = mongoose.model('Paciente', pacienteSchema);
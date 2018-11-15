var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var medicoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
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
        required: [true, 'El id hospital es obligatorio ']
    }
});


module.exports = mongoose.model('Medico', medicoSchema);
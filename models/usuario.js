
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// Para controlar los roles que voy a permitir
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


// Funcion que recibe el objeto, configuracion del esquema que voy a definir
// Dentro del esquema va cada uno de los campos que uso dentro de la BD menos el id.
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es obligatorio']},
    apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
    email: { type: String, unique:true, required: [true, 'El correo es obligatorio']},
    password: { type: String, required: [true, 'La contraseña es obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }

});

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'});




// Para poder utilizar el esquema fuera de este archivo, defino el nombre que quiero que tenga el esquema en este caso seria 'Usuario' y el objeto que quiero que se relacione que seria usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);
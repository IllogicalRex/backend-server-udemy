// Importando libreria
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

// esquema de usuarios
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
});

// Modificar los mensajes, antes se tiene que instalar el unique-validator
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' })

// para usar el Schema fuera de el archivo
module.exports = mongoose.model('Usuario', usuarioSchema);
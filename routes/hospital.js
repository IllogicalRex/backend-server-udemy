var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');



//inicializar variables
var app = express();
var Hospital = require('../models/hospital');

//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//=====================================================
// Obtener todos los hospitales
//=====================================================
app.get('/', (req, res, next) => {
    Hospital.find({}, 'nombre img usuario')

    .exec((err, hospitales) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            hospitales: hospitales
        });
    });
});
//=====================================================
// Actualizar Hospital
//=====================================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe.',
                errors: { message: 'No existe un usuario con ese ID.' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;

        // para guardar un usuario
        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
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
//=====================================================
// Crear un nuevo hospital
//=====================================================
app.post('/', (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });
    });

});
//=====================================================
// Elimiar usuarios
//=====================================================

module.exports = app;
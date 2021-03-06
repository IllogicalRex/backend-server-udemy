var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAtenticacion = require('../middlewares/atenticacion');

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
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') //busca los campos que queremos de otra coleccion
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    hospitales: hospitales
                });

            });
        });
});
//=====================================================
// Actualizar Hospital
//=====================================================
app.put('/:id', mdAtenticacion.verificaToken, (req, res) => {

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
            return res.status(500).json({
                ok: false,
                mensaje: 'El hospital con el id: ' + id + ' no existe.',
                errors: { message: 'No existe un hospital con ese ID.' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

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
app.post('/', mdAtenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
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
            hospital: hospitalGuardado
        });
    });

});
//=====================================================
// Elimiar Hospital por id
//=====================================================
app.delete('/:id', mdAtenticacion.verificaToken, (req, res) => {
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
                mensaje: 'El hospital con el id: ' + id + ' no existe.',
                errors: { message: 'No existe un hospital con ese ID.' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
})
module.exports = app;
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;



// ======================================
// VERIFICAR TOKEN
// ====================================== 
exports.verificaToken = function (req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        // Para obtener toda la informacion del usuario hizo la peticion
        req.usuario = decoded.usuario;

        next();
    });


}
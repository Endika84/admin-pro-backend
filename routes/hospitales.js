/**
 * Ruta base: /api/hospitales
 */

const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getHospitales,
    createHospital,
    editHospital,
    deleteHospital
 } = require('../controllers/hospitales');

const router= Router();

router.get('/', validarJWT, getHospitales);

router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ], 
    createHospital
);

router.put('/:id',
    [],  
    editHospital
);

router.delete('/:id', deleteHospital);

module.exports = router;
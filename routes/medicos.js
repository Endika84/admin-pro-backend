/**
 * Ruta base: /api/medicos
 */

const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getMedicos,
    createMedico,
    editMedico,
    deleteMedico
 } = require('../controllers/medicos');

const router= Router();

router.get('/', validarJWT, getMedicos);

router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe de ser valido').isMongoId(),
        validarCampos
    ], 
    createMedico
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe de ser valido').isMongoId(),
        validarCampos
    ],  
    editMedico
);

router.delete('/:id', validarJWT, deleteMedico);

module.exports = router;
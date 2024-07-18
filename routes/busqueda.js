/**
 * Ruta base: /api/todo/
 */

const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getBusqueda,
    getColeccion
 } = require('../controllers/busqueda');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get('/:termino', validarJWT, getBusqueda);

router.get('/coleccion/:tabla/:termino', validarJWT, getColeccion);


module.exports = router;
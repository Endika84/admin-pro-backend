/**
 * Ruta base: /api/upload/
 */

const {Router} = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');

const {fileUpload, retornaImagen} = require('../controllers/uploads');


const router = Router();

//middleware para subir archivos
router.use(expressFileUpload());

router.put('/:coleccion/:id', validarJWT, fileUpload);
router.get('/:coleccion/:foto', retornaImagen);


module.exports = router;
const path = require('path');
const fs = require('fs');

const {response} = require('express');
const { v4: uuidv4 } = require('uuid');
const {actualizarImagen}= require('../helpers/actualizar-imagen');


const fileUpload = (req, res= response) => {

    const coleccion = req.params.coleccion;
    const id = req.params.id;

    //validar coleccion
    const coleccionesValidas = ['hospitales', 'medicos', 'usuarios'];

    if(!coleccionesValidas.includes(coleccion)){
        return res.status(400).json({
            ok: false,
            msg:  'La coleccion seleccionada no s un medico, usuario u hospital'
        });
    }

    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    //procesar la imagen...
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length -1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if(!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok: false,
            msg:  'No es una extensión permitida'
        });
    }

    //Generar el nombre del archivo (es necesario renombrar la imagen q suban)
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //generar el path para guardar la imagen
    const path = `./uploads/${coleccion}/${nombreArchivo}`;

    //mover la imagen
    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //actualizar base de datos
        actualizarImagen(coleccion, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });

}


const retornaImagen = (req, res= response) => {

    const coleccion = req.params.coleccion;
    const foto = req.params.foto;

    let pathImg = path.join( __dirname, `../uploads/${coleccion}/${foto}` );

    //imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        res.sendFile(pathImg);
    }


}


module.exports = {
    fileUpload,
    retornaImagen
}
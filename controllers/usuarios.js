const {response} = require('express');
const bcrypt = require('bcryptjs');
// const { } = require('mongoose');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {
    //el primer parametro de find es un filtro, y el segundo lo que queremos que retorne
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })
};

const createUser = async(req, res = response) => {

    const { password, email } = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt= bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guardar usuario
        await usuario.save();

        //Generar token¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
        const token= await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario: usuario, 
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...  revisar logs'
        });
    }
    
};

const editUsuario = async(req, res= response) => {

    //TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    
    try {
        const usuarioDB= await Usuario.findById(uid);
        console.log("uDB: ",usuarioDB);
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });
        }

        //Actualizaciones
        const {password, google, email, ...campos} = req.body;
        console.log("reqU", campos);

        if(usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({email: email});
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email',
                    existeEmail //lo pongo por verlo
                });
            }
        }

        campos.email = email;

        //el parametro new: true, lo que hace es traer el usuario ya actualizado con los cambios
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const deleteUsuario = async(req, res= response) => {

    const uid= req.params.id;
    
    try {

        const usuarioDB= await Usuario.findById(uid);
        console.log(usuarioDB);
        if(!usuarioDB){
            console.log('entro al error no hay usuario con uid');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        
        res.json({
            ok: true,
            msg: 'Usuario borrado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

module.exports = {
    getUsuarios,
    createUser,
    editUsuario,
    deleteUsuario,
}
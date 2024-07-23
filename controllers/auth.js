const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');



const login = async(req, res= response) => {

    const {email, password} = req.body;

    try {
        
        //verificar email
        const userDB= await Usuario.findOne({email});

        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        
        //verificar contraseña
        const validPassword= bcrypt.compareSync(password, userDB.password);

        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        //*Generar el token si email y contraseña son validos
        const token = await generarJWT(userDB.id);
        
        
        res.json({
            ok: true,
            token,
            userDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Error inesperado...'
        });
    }

};


const googleSignIn = async(req, res= response) => {
    
    try {
        const { email, name, picture, ...rest } = await googleVerify(req.body.token);
        
        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            usuario = usuarioDB;
            usuario.google = true;
        }

        //guardar usuario
        await usuario.save();

        //general JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true, 
            email, name, picture,
            token,
            ...rest
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false, 
            msg: 'Token de google no es correcto'
        });    
    }
    
} 


const renewToken = async(req, res = response) => {

    const uid= req.uid;

    //general JWT
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        uid
    });
}



module.exports = {
    login,
    googleSignIn,
    renewToken
}
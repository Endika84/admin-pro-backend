const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');



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



module.exports = {
    login,
}
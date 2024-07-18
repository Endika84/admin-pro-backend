const { response } = require("express");
const bcrypt = require('bcryptjs');
const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');

const getHospitales = async(req, res= response) => {

    try {

        const hospitales= await Hospital.find()
                                        .populate('usuario', 'nombre img');

        res.json({
            ok: true,
            hospitales
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal...'
        });
    }
    

}

const createHospital = async(req, res = response) => {

    const { nombre } = req.body;
    const uid= req.uid;

    try {

        const existeNombreHospital = await Hospital.findOne({nombre});

        if(existeNombreHospital){
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del hospital ya existe'
            });
        }

        const hospital = new Hospital({
            usuario: uid,
            ...req.body
        });

        //guardar hospital
        await hospital.save();

        res.json({
            ok: true,
            hospital: hospital
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...  revisar logs'
        });
    }
    
};

const editHospital = async(req, res= response) => {

    //* Validar token y comprobar si es el hospital correcto
    const uid = req.params.id;
    
    try {
        const hospitalDB= await Hospital.findById(uid);
        console.log("uDB: ",hospitalDB);
        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            });
        }

        //Actualizaciones
        const {password, google, email, ...campos} = req.body;
        console.log("reqU", campos);

        if(hospitalDB.email !== email) {
            const existeEmail = await Hospital.findOne({email: email});
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un hospital con ese email',
                    existeEmail //lo pongo por verlo
                });
            }
        }

        campos.email = email;

        //el parametro new: true, lo que hace es traer el hospital ya actualizado con los cambios
        const hospitalActualizado = await Hospital.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const deleteHospital = async(req, res= response) => {

    const uid= req.params.id;
    
    try {

        const hospitalDB= await Hospital.findById(uid);
        console.log(hospitalDB);
        if(!hospitalDB){
            console.log('entro al error no hay hospital con uid');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese uid'
            });
        }

        await Hospital.findByIdAndDelete(uid);
        
        res.json({
            ok: true,
            msg: 'Hospital borrado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

module.exports= {
    getHospitales,
    createHospital,
    editHospital,
    deleteHospital,
}
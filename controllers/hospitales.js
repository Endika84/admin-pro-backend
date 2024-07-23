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
    const id = req.params.id;
    const uid = req.uid;
    
    try {
        const hospitalDB= await Hospital.findById(id);
        //console.log("uDB: ",hospitalDB);
        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found by id'
            });
        }

        //Actualizaciones
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        //el parametro new: true, lo que hace es traer el hospital ya actualizado con los cambios
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});

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

    const id= req.params.id;
    
    try {

        const hospitalDB= await Hospital.findById(id);
        console.log(hospitalDB);
        if(!hospitalDB){
            console.log('entro al error no hay hospital con id');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        }

        await Hospital.findByIdAndDelete(id);
        
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
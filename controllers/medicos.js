const { response } = require("express");
const bcrypt = require('bcryptjs');
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async(req, res= response) => {

    try {

        const medicos= await Medico.find()
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre');
    
        res.json({
            ok: true,
            medicos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal en el servidor'
        });
    }
    

}

const createMedico = async(req, res = response) => {

    const uid = req.uid;
    const {nombre}= req.body;

    try {

        const existeMedico = await Medico.findOne({nombre});

        if(existeMedico){
            return res.status(400).json({
                ok: false,
                msg: 'El medico ya esta registrado'
            });
        }

        const medico = new Medico({
            ...req.body,
            usuario: uid
        });

        //guardar medico
        await medico.save();

        res.json({
            ok: true,
            medico
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...  revisar logs'
        });
    }
    
};

const editMedico = async(req, res= response) => {

    //* Validar token y comprobar si es el medico es correcto
    const id = req.params.id;
    const uid = req.uid;
    
    try {
        const medicoDB= await Medico.findById(id);
        //console.log("uDB: ",medicoDB);
        if(!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'Medico not found by id'
            });
        }

        //Actualizaciones
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        //el parametro new: true, lo que hace es traer el medico ya actualizado con los cambios
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok: true,
            medico: medicoActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const deleteMedico = async(req, res= response) => {

    const id= req.params.id;
    
    try {

        const medicoDB= await Medico.findById(id);

        if(!medicoDB){
            console.log('entro al error no hay medico con id');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese id'
            });
        }

        await Medico.findByIdAndDelete(id);
        
        res.json({
            ok: true,
            msg: 'Medico borrado'
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
    getMedicos,
    createMedico,
    editMedico,
    deleteMedico,
}
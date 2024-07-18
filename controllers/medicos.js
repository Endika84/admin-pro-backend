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

    //* Validar token y comprobar si es el Medico correcto
    const uid = req.params.id;
    
    try {
        const medicoDB= await Medico.findById(uid);
        console.log("uDB: ", medicoDB);
        if(!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'Medico not found'
            });
        }

        //Actualizaciones
        const {password, google, email, ...campos} = req.body;
        console.log("reqU", campos);

        if(medicoDB.email !== email) {
            const existeEmail = await Medico.findOne({email: email});
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un medico con ese email',
                    existeEmail //lo pongo por verlo
                });
            }
        }

        campos.email = email;

        //el parametro new: true, lo que hace es traer el Medico ya actualizado con los cambios
        const medicoActualizado = await Medico.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            Medico: medicoActualizado
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

    const uid= req.params.id;
    
    try {

        const MedicoDB= await Medico.findById(uid);
        console.log(medicoDB);
        if(!medicoDB){
            console.log('entro al error no hay medico con uid');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese uid'
            });
        }

        await Medico.findByIdAndDelete(uid);
        
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
const { model, Schema } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    usuario:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, {
    collection: 'hospitales'
});

HospitalSchema.method('toJSON', function(){
    const { __v, ...object} = this.toObject();
    return object;
});

//por defecto moongose añade el plural "usuarios" cuando se cree la db
module.exports = model('Hospital', HospitalSchema);
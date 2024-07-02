require('dotenv').config();

const express = require('express');
var cors = require('cors');

const { dbConnection } = require('./database/config');


//crear servidor express
const app = express();

//Configurar cors
app.use(cors());

//Base de datos
dbConnection();

//main_user
//jvHCp0Pl6RNe52lm


// Rutas
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola mundo'
    })

});






//levantar el servidor de express
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo en puerto ', process.env.PORT || 3000);
});
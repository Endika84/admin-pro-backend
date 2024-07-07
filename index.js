require('dotenv').config();

const express = require('express');
var cors = require('cors');

const { dbConnection } = require('./database/config');

//crear servidor express
const app = express();

//Configurar cors
app.use(cors());

//lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

//levantar el servidor de express
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo en puerto ', process.env.PORT || 3000);
});
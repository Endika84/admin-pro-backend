require('dotenv').config();

const express = require('express');
var cors = require('cors');

const { dbConnection } = require('./database/config');

//crear servidor express
const app = express();

//Configurar cors
app.use(cors());

//carpeta pública
app.use(express.static('public'));

//lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

// Rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busqueda'));
app.use('/api/upload', require('./routes/uploads'));

//levantar el servidor de express
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo en puerto ', process.env.PORT || 3000);
});
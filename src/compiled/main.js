"use strict";
//Cargamos dependencias
const express = require("express");
const cors = require("cors");
const routes = require("./infrastructure/routes");
const connection = require('./infrastructure/db/Connection');
//Conexion a base de datos
connection.InizializeDataSource();
//Creamos el servidor
const app = express();
const port = 3484;
//Configuramos CORS y 
app.use(cors());
//Covertimos datos del body a objetos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Usar las rutas del router
app.use('/api', routes);
//Poner a escuchar el servidor (que se mantenga activo y no cierre la app)
app.listen(port, () => {
    console.log("corriendo api");
});

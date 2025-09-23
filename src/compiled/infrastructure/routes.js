"use strict";
const expressApp = require('express');
const mainRouter = expressApp.Router();
const billRoutes = require('./Routes/BillRoute');
// Usar las rutas de facturas
mainRouter.use('/', billRoutes);
module.exports = mainRouter;

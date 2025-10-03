"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BillRoute_1 = require("./BillRoute");
const ProductRoute_1 = require("./ProductRoute");
const BillDetailsRoute_1 = require("../../infrastructure/Routes/BillDetailsRoute");
const mainRouter = express_1.default.Router();
// Usar las rutas de facturas
mainRouter.use('/', BillRoute_1.billRouter);
mainRouter.use('/', ProductRoute_1.productRouter);
mainRouter.use('/', BillDetailsRoute_1.billDetailsRouter);
exports.default = mainRouter;

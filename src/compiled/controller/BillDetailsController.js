"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetails = exports.saveDetails = exports.setService = void 0;
let service;
const setService = (detailsService) => {
    service = detailsService;
};
exports.setService = setService;
const saveDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        yield service.saveAll(data);
        return res.status(201).send({
            status: "success",
            message: "El detalle fue agregado correctamente",
            data: data
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "Datos inválidos",
                errors: error.issues || error.errors,
            });
        }
        console.log(error.message);
        return res.status(500).send({
            status: "error",
            message: "Hubo en error en el servidor al guardar el detalle",
            errors: error
        });
    }
});
exports.saveDetails = saveDetails;
const getDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getAll();
        console.log(data);
        return res.status(200).send({
            status: "success",
            message: "Detalles obtenidos corretamente",
            data: data
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Hubo un error en el servidor",
            errors: error.error
        });
    }
});
exports.getDetails = getDetails;

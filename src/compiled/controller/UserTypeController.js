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
exports.getTypes = exports.saveType = exports.setService = void 0;
const UserTypeValidations_1 = require("../application/validations/UserTypeValidations");
let service;
const setService = (typeService) => (service = typeService);
exports.setService = setService;
const saveType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const dataValidated = UserTypeValidations_1.UserTypeSchema.parse(data);
        yield service.save(dataValidated);
        return res.status(201).send({
            status: "sucess",
            message: "El tipo de usuario fue registrado correctamente",
            data: dataValidated
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
        return res.status(500).send({
            status: "error",
            message: "Hubo un error",
            errors: error.errors || error.issues,
        });
    }
});
exports.saveType = saveType;
const getTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getAll();
        return res.status(200).send({
            status: "sucess",
            message: "Tipos de usuarios obtenidos exitosamente",
            data: data
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Hubo un error al obtener los datos: " + error.message,
        });
    }
});
exports.getTypes = getTypes;

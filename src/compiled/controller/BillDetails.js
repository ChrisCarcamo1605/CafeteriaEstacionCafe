"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDetails = exports.setService = void 0;
const BillDetailsValidations_1 = require("../application/validations/BillDetailsValidations");
let service;
const setService = (detailsService) => {
    service = detailsService;
};
exports.setService = setService;
const saveDetails = (req, res) => {
    try {
        const data = req.body;
        const validatedData = BillDetailsValidations_1.BillDetailsSchema.parse(data);
        service.create(validatedData);
        return res.status(201).send({
            status: "success",
            message: "El detalle fue agregado correctamente",
            data: validatedData,
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
            errors: error,
        });
    }
};
exports.saveDetails = saveDetails;

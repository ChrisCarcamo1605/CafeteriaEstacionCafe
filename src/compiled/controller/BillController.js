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
const Bill_1 = require("../domain/Bill");
const BillRepository_1 = require("../infrastructure/repositories/BillRepository");
const repo = new BillRepository_1.BillRepository();
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield repo.getData();
        console.log(`corriendo metodo list del controller`);
        return res.status(200).send({ body: data });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener las facturas"
        });
    }
});
const saveBill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        console.log(`entramos viejo, aquí está el body: `, body);
        if (!body) {
            console.log("Hubo un error en el save de bill washo");
            return res.status(400).send({
                status: "error",
                message: "Faltan datos krnal",
            });
        }
        const bill = new Bill_1.Bill();
        bill.billId = body.billId;
        bill.cashRegister = body.cashRegister;
        bill.customer = body.customer;
        bill.date = body.date;
        bill.total = body.total;
        // Usar el método del repositorio
        yield repo.save(bill);
        return res.status(201).send({
            message: "Datos enviados correctamente",
            req: body,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar la factura"
        });
    }
});
module.exports = { list, saveBill };

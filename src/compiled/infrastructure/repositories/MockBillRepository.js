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
exports.MockBillRepository = void 0;
class MockBillRepository {
    constructor() {
        this.bills = [];
        this.currentId = 1;
    }
    save(bill) {
        return __awaiter(this, void 0, void 0, function* () {
            bill.billId = this.currentId++;
            this.bills.push(bill);
            console.log('Mock: Factura guardada', bill);
            return bill;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Mock: Obteniendo todas las facturas');
            return [...this.bills];
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Mock: Buscando factura por ID:', id);
            return this.bills.find(bill => bill.billId === id) || null;
        });
    }
    update(id, billData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Mock: Actualizando factura:', id, billData);
            const index = this.bills.findIndex(bill => bill.billId === id);
            if (index === -1)
                return null;
            this.bills[index] = Object.assign(Object.assign({}, this.bills[index]), billData);
            return this.bills[index];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Mock: Eliminando factura:', id);
            const index = this.bills.findIndex(bill => bill.billId === id);
            if (index === -1)
                return false;
            this.bills.splice(index, 1);
            return true;
        });
    }
}
exports.MockBillRepository = MockBillRepository;

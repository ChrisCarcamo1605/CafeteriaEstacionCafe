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
exports.TypeOrmBillRepository = void 0;
class TypeOrmBillRepository {
    constructor(repository) {
        this.repository = repository;
    }
    save(bill) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.save(bill);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne({ where: { billId: id } });
        });
    }
    update(id, billData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ billId: id }, billData);
            return yield this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.delete({ billId: id });
            return (result.affected || 0) > 0;
        });
    }
}
exports.TypeOrmBillRepository = TypeOrmBillRepository;

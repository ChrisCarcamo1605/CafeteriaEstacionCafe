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
exports.BillRepository = void 0;
const Connection_1 = require("../db/Connection");
const Bill_1 = require("../../domain/Bill");
class BillRepository {
    constructor() {
        this.save = (bill) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = yield this.repository;
                return yield repo.save(bill);
            }
            catch (error) {
                console.error('Error saving bill:', error);
                throw error;
            }
        });
        this.getData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = yield this.repository;
                const data = yield repo.find();
                if (!Array.isArray(data)) {
                    console.warn("Retrieved data is not an array:", data);
                    return [];
                }
                return data;
            }
            catch (error) {
                console.error('Error retrieving bills:', error);
                return [];
            }
        });
        this.repository = (0, Connection_1.InizializeDataSource)()
            .then((dataSource) => {
            if (dataSource) {
                return dataSource.getRepository(Bill_1.Bill);
            }
            throw new Error('DataSource initialization failed');
        })
            .catch((err) => {
            console.error(`Database connection error: ${err}`);
            throw err;
        });
    }
}
exports.BillRepository = BillRepository;

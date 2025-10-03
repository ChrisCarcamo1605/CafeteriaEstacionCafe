"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillDetailsSchema = void 0;
const zod_1 = require("zod");
exports.BillDetailsSchema = zod_1.z.object({
    billId: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, "El ID debe ser un número positivo"),
    producId: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, "El ID debe ser un número positivo"),
    quantity: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, "El ID debe ser un número positivo")
});

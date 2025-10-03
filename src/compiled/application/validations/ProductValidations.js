"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "El nombre no puede estar vacio")
        .max(50, "El nombre no puede ser mayor a 50 caracteres")
        .trim(),
    description: zod_1.z
        .string()
        .min(1, "El nombre del cliente no puede estar vacío")
        .max(100, "El nombre del cliente es muy largo")
        .trim(),
    price: zod_1.z
        .string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val > 0, "El precio debe ser mayor a 0"),
    cost: zod_1.z
        .string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val > 0, "El costo debe ser mayor a 0"),
});
module.exports = { productSchema: exports.productSchema };

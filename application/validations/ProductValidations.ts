import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre no puede estar vacio")
    .max(50, "El nombre no puede ser mayor a 50 caracteres")
    .trim(),

  description: z
    .string()
    .min(1, "El nombre del cliente no puede estar vacío")
    .max(100, "El nombre del cliente es muy largo")
    .trim(),

  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "El precio debe ser mayor a 0"),

  cost: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "El costo debe ser mayor a 0"),
});

module.exports = { productSchema };

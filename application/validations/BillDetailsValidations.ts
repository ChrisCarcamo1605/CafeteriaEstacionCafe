import { z } from "zod";

export const BillDetailsSchema = z.object({
  billId: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "El ID debe ser un número positivo"
    ),
  producId: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "El ID debe ser un número positivo"
    ),
    quantity: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "El ID debe ser un número positivo"
    ),
    subTotal: z.string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val > 0, "El total debe ser mayor a 0")
});

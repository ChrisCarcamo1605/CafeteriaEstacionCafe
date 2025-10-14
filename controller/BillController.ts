import { Bill } from "../domain/entities/Bill";
import { IService } from "../domain/interfaces/IService";
import { billSchema } from "../application/validations/BillValidations";
import { SaveBillDTO, BillItemDTO } from "../application/DTOs/BillsDTO";

let service:IService;
export const setService = (billService:IService)=>{
  service = billService;
}

export const getBills = async (req: any, res: any) => {
  try {
    const data = await service.getAll();

    return res.status(200).send({ body: data });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: `Error al conseguir las facturas ${error}`,
    });
  }
};

export const saveBill = async (req: any, res: any) => {
  try {
    const billData: SaveBillDTO = req.body;
    const validatedData = billSchema.parse(billData);
    console.log(`Datos validados correctamente:`, validatedData);

    await service.save(validatedData);

    return res.status(201).send({
      message: "Factura creada correctamente",
      data: {
       validatedData
      },
    });
  } catch (error: any) {

     if (error.name === "ZodError") {
      return res.status(400).send({
        status: "error",
        message: "Datos inválidos: " + error.issues[0].message,
        campo: error.issues[0].path,
        error: error.issues[0].code,
        
      });
    }

    console.error('Error al guardar factura:', error);
    return res.status(500).send({
      status: "error", 
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};

// Las funciones ya están exportadas individualmente arriba

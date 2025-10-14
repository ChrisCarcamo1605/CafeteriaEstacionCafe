import { ca } from "zod/v4/locales";
import { IService } from "../domain/interfaces/IService";
import { UserTypeSchema } from "../application/validations/UserTypeValidations";
import { stat } from "fs";

let service: IService;
export const setService = (typeService: IService) => (service = typeService);

export const saveType = async (req: any, res: any) => {
  try {
    const data = req.body;
    const dataValidated = UserTypeSchema.parse(data);
    await service.save(dataValidated);

    return res.status(201).send({
      status: "sucess",
      message: "El tipo de usuario fue registrado correctamente",
      data: dataValidated
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).send({
        status: "error",
        message: "Datos inválidos",
        errors: error.issues || error.errors,
      });
    }

    return res.status(500).send({
      status: "error",
      message: "Hubo un error",
      errors: error.errors || error.issues,
    });
  }
};

export const getTypes = async (req: any, res: any) => {
  try {
    const data = await service.getAll();
    return res.status(200).send({
      status: "sucess",
      message: "Tipos de usuarios obtenidos exitosamente",
      data: data
    });
  } catch (error: any) {
    return res.status(500).send({
      status: "error",
      message: "Hubo un error al obtener los datos: " +error.message,
    });
  }
};

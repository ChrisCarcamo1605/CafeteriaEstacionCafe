import { IService } from "../domain/interfaces/IService";
import { productSchema } from "../application/validations/ProductValidations";
import { ProductItemDTO, SaveProductDTO } from "../application/DTOs/ProductDTO";
let service: IService;
export const setService = (productService: IService) => {
  service = productService;
};

export const saveProduct = async (req: any, res: any) => {
  try {
    const data = req.body;
    const validatedData = productSchema.parse(data);

    await service.save(validatedData);
    return res.status(201).send({
      status: "success",
      message: "El producto se guardo correctamente",
      data: validatedData,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).send({
        status: "error",
        message: "Datos inválidos",
        errors: error.issues || error.errors,
      });
    }

    console.log(error.message);

    return res.status(500).send({
      status: "error",
      message: "Hubo en error en el servidor al guardar el producto",
      errors: error,
    });
  }
};

export const getProducts = async (req: any, res: any) => {
  try {
    const products = await service.getAll();

    const productDTOs: ProductItemDTO[] = products.map((product) => ({
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
    }));

    return res.status(200).send({
      status: "success",
      data: productDTOs,
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

    return res.status(500).send({
      status: "error",
      message: "Error al obtener los productos",
      errors: error.issues || error.errors,
    });
  }
};

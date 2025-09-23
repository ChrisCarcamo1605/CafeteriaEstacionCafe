import { Bill } from "../domain/Bill";
import { BillRepository } from "../infrastructure/repositories/BillRepository";

const repo = new BillRepository();

const list = async (req: any, res: any) => {
  try {
    
    const data = await repo.getData();
    console.log(`corriendo metodo list del controller`);
    
    return res.status(200).send({ body: data });
  } catch (error) {
    return res.status(500).send({ 
      status: "error", 
      message: "Error al obtener las facturas" 
    });
  }
};

const saveBill = async (req: any, res: any) => {
  try {
    const body = req.body;
    console.log(`entramos viejo, aquí está el body: `, body);

    if (!body) {
      console.log("Hubo un error en el save de bill washo");
      return res.status(400).send({
        status: "error",
        message: "Faltan datos krnal",
      });
    }

    const bill = new Bill();
    bill.billId = body.billId;
    bill.cashRegister = body.cashRegister;
    bill.customer = body.customer;
    bill.date = body.date;
    bill.total = body.total;

    // Usar el método del repositorio
    await repo.save(bill);

    return res.status(201).send({
      message: "Datos enviados correctamente",
      req: body,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al guardar la factura"
    });
  }
};

module.exports = { list, saveBill };

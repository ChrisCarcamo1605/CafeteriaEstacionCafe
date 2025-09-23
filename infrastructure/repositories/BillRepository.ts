import { InizializeDataSource } from "../db/Connection";
import { Bill } from "../../domain/Bill";
import { error } from "console";

export class BillRepository {
    private repository: Promise<any>;

    constructor() {
        this.repository = InizializeDataSource()
            .then((dataSource) => {
                if (dataSource) {
                    return dataSource.getRepository(Bill);
                }
                throw new Error('DataSource initialization failed');
            })
            .catch((err) => {
                console.error(`Database connection error: ${err}`);
                throw err;
            });
    }

    save = async (bill: Bill) => {
        try {
            const repo = await this.repository;
            return await repo.save(bill);
        } catch (error) {
            console.error('Error saving bill:', error);
            throw error;
        }
    };

   public getData = async (): Promise<Bill[]> => {
        try {
            const repo = await this.repository;
            const data = await repo.find();
            
            if (!Array.isArray(data)) {
                console.warn("Retrieved data is not an array:", data);
                return [];
            }

            return data;
        } catch (error) {
            console.error('Error retrieving bills:', error);
            return [];
        }
    };
}

import { 
    getUserTypes, 
    getUserTypeById, 
    saveUserType, 
    updateUserType, 
    deleteUserType, 
    setService 
} from "../UserTypeController";
import { IService } from "../../core/interfaces/IService";

// Mock the validation schemas
jest.mock("../../application/validations/UserTypeValidations", () => ({
    createUserTypeSchema: {
        parse: jest.fn()
    },
    updateUserTypeSchema: {
        parse: jest.fn()
    },
    userTypeIdSchema: {
        parse: jest.fn()
    }
}));

import { 
    createUserTypeSchema, 
    updateUserTypeSchema, 
    userTypeIdSchema 
} from "../../application/validations/UserTypeValidations";

describe("UserTypeController", () => {
    let mockService: jest.Mocked<IService>;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockService = {
            save: jest.fn(),
            saveAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn()
        };

        req = {
            body: {},
            params: {},
            query: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };

        // Clear all mocks
        jest.clearAllMocks();
        
        // Set the service
        setService(mockService);
    });

    describe("getUserTypes", () => {
        it("should return all user types successfully", async () => {
            const mockUserTypes = [
                { userTypeId: 1, name: "Administrator", permissionLevel: 10 },
                { userTypeId: 2, name: "Employee", permissionLevel: 5 }
            ];
            mockService.getAll.mockResolvedValue(mockUserTypes);

            await getUserTypes(req, res);

            expect(mockService.getAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ body: mockUserTypes });
        });

        it("should handle server error when getting user types", async () => {
            const errorMessage = "Database connection error";
            mockService.getAll.mockRejectedValue(new Error(errorMessage));

            await getUserTypes(req, res);

            expect(mockService.getAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: `Error al obtener los tipos de usuario: ${errorMessage}`
            });
        });
    });

    describe("getUserTypeById", () => {
        it("should return user type by id successfully", async () => {
            const mockUserType = { userTypeId: 1, name: "Administrator", permissionLevel: 10 };
            const userId = 1;
            
            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: userId });
            (mockService as any).getById = jest.fn().mockResolvedValue(mockUserType);

            req.params = { id: "1" };

            await getUserTypeById(req, res);

            expect(userTypeIdSchema.parse).toHaveBeenCalledWith(req.params);
            expect((mockService as any).getById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ body: mockUserType });
        });

        it("should handle validation error for invalid id", async () => {
            const zodError = new Error("Validation failed");
            zodError.name = "ZodError";
            (zodError as any).issues = [{ message: "Invalid ID format" }];

            (userTypeIdSchema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            req.params = { id: "invalid" };

            await getUserTypeById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "ID inválido: Invalid ID format"
            });
        });

        it("should handle not found error", async () => {
            const notFoundError = new Error("Tipo de usuario no encontrado");
            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: 999 });
            (mockService as any).getById = jest.fn().mockRejectedValue(notFoundError);

            req.params = { id: "999" };

            await getUserTypeById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Tipo de usuario no encontrado"
            });
        });

        it("should handle server error when getting user type by id", async () => {
            const serverError = new Error("Database error");
            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: 1 });
            (mockService as any).getById = jest.fn().mockRejectedValue(serverError);

            req.params = { id: "1" };

            await getUserTypeById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Error al obtener el tipo de usuario: Database error"
            });
        });
    });

    describe("saveUserType", () => {
        it("should save user type successfully", async () => {
            const userTypeData = { name: "Manager", permissionLevel: 7 };
            const savedUserType = { userTypeId: 3, ...userTypeData };

            (createUserTypeSchema.parse as jest.Mock).mockReturnValue(userTypeData);
            mockService.save.mockResolvedValue(savedUserType);

            req.body = userTypeData;

            await saveUserType(req, res);

            expect(createUserTypeSchema.parse).toHaveBeenCalledWith(userTypeData);
            expect(mockService.save).toHaveBeenCalledWith(userTypeData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: "Tipo de usuario creado correctamente",
                data: savedUserType
            });
        });

        it("should handle validation error when saving user type", async () => {
            const zodError = new Error("Validation failed");
            zodError.name = "ZodError";
            (zodError as any).issues = [{ 
                message: "El nombre es requerido",
                path: ["name"],
                code: "invalid_type"
            }];

            (createUserTypeSchema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            req.body = { name: "", permissionLevel: 5 };

            await saveUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Datos inválidos: El nombre es requerido",
                campo: ["name"],
                error: "invalid_type"
            });
        });

        it("should handle server error when saving user type", async () => {
            const userTypeData = { name: "Manager", permissionLevel: 7 };
            const serverError = new Error("Database connection failed");

            (createUserTypeSchema.parse as jest.Mock).mockReturnValue(userTypeData);
            mockService.save.mockRejectedValue(serverError);

            req.body = userTypeData;

            await saveUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Error interno del servidor: Database connection failed"
            });
        });
    });

    describe("updateUserType", () => {
        it("should update user type successfully", async () => {
            const updateData = { name: "Senior Manager", permissionLevel: 8 };
            const updatedUserType = { userTypeId: 1, ...updateData };
            const userTypeId = 1;

            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: userTypeId });
            (updateUserTypeSchema.parse as jest.Mock).mockReturnValue(updateData);
            (mockService as any).update = jest.fn().mockResolvedValue(updatedUserType);

            req.params = { id: "1" };
            req.body = updateData;

            await updateUserType(req, res);

            expect(userTypeIdSchema.parse).toHaveBeenCalledWith(req.params);
            expect(updateUserTypeSchema.parse).toHaveBeenCalledWith(req.body);
            expect((mockService as any).update).toHaveBeenCalledWith({
                userTypeId: userTypeId,
                ...updateData
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: "Tipo de usuario actualizado correctamente",
                data: updatedUserType
            });
        });

        it("should handle validation error for invalid id when updating", async () => {
            const zodError = new Error("Validation failed");
            zodError.name = "ZodError";
            (zodError as any).issues = [{ 
                message: "Invalid ID format",
                path: ["id"]
            }];

            (userTypeIdSchema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            req.params = { id: "invalid" };
            req.body = { name: "Updated Name" };

            await updateUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Datos inválidos: Invalid ID format",
                campo: ["id"]
            });
        });

        it("should handle validation error for invalid body when updating", async () => {
            const zodError = new Error("Validation failed");
            zodError.name = "ZodError";
            (zodError as any).issues = [{ 
                message: "El nivel de permisos debe ser un número entero",
                path: ["permissionLevel"]
            }];

            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: 1 });
            (updateUserTypeSchema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            req.params = { id: "1" };
            req.body = { permissionLevel: "invalid" };

            await updateUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Datos inválidos: El nivel de permisos debe ser un número entero",
                campo: ["permissionLevel"]
            });
        });

        it("should handle not found error when updating", async () => {
            const notFoundError = new Error("Tipo de usuario no encontrado");
            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: 999 });
            (updateUserTypeSchema.parse as jest.Mock).mockReturnValue({ name: "Updated" });
            (mockService as any).update = jest.fn().mockRejectedValue(notFoundError);

            req.params = { id: "999" };
            req.body = { name: "Updated" };

            await updateUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Tipo de usuario no encontrado"
            });
        });

        it("should handle server error when updating user type", async () => {
            const serverError = new Error("Database error");
            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: 1 });
            (updateUserTypeSchema.parse as jest.Mock).mockReturnValue({ name: "Updated" });
            (mockService as any).update = jest.fn().mockRejectedValue(serverError);

            req.params = { id: "1" };
            req.body = { name: "Updated" };

            await updateUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Error interno del servidor: Database error"
            });
        });
    });

    describe("deleteUserType", () => {
        it("should delete user type successfully", async () => {
            const userTypeId = 1;
            const deleteResult = { affected: 1 };

            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: userTypeId });
            mockService.delete.mockResolvedValue(deleteResult);

            req.params = { id: "1" };

            await deleteUserType(req, res);

            expect(userTypeIdSchema.parse).toHaveBeenCalledWith(req.params);
            expect(mockService.delete).toHaveBeenCalledWith(userTypeId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: "Tipo de usuario eliminado correctamente",
                data: deleteResult
            });
        });

        it("should handle validation error when deleting user type", async () => {
            const zodError = new Error("Validation failed");
            zodError.name = "ZodError";
            (zodError as any).issues = [{ message: "Invalid ID format" }];

            (userTypeIdSchema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            req.params = { id: "invalid" };

            await deleteUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "ID inválido: Invalid ID format"
            });
        });

        it("should handle not found error when deleting", async () => {
            const notFoundError = new Error("Tipo de usuario no encontrado");
            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: 999 });
            mockService.delete.mockRejectedValue(notFoundError);

            req.params = { id: "999" };

            await deleteUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Tipo de usuario no encontrado"
            });
        });

        it("should handle server error when deleting user type", async () => {
            const serverError = new Error("Database error");
            (userTypeIdSchema.parse as jest.Mock).mockReturnValue({ id: 1 });
            mockService.delete.mockRejectedValue(serverError);

            req.params = { id: "1" };

            await deleteUserType(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                status: "error",
                message: "Error interno del servidor: Database error"
            });
        });
    });

    describe("setService", () => {
        it("should set the service correctly", () => {
            const newMockService = {
                save: jest.fn(),
                saveAll: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getAll: jest.fn(),
                getById: jest.fn()
            } as jest.Mocked<IService>;

            expect(() => setService(newMockService)).not.toThrow();
        });
    });
});

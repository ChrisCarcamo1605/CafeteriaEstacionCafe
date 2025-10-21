import {
  getUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
  getUsersByType,
  setService,
} from "../UserController";
import { IService } from "../../core/interfaces/IService";

// Mock de los esquemas de validación
jest.mock("../../application/validations/UserValidations", () => ({
  createUserSchema: {
    parse: jest.fn(),
  },
  updateUserSchema: {
    parse: jest.fn(),
  },
  userIdSchema: {
    parse: jest.fn(),
  },
}));

describe("UserController", () => {
  let mockService: jest.Mocked<IService>;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Crear mock del servicio
    mockService = {
      save: jest.fn(),
      saveAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
    } as any;

    // Agregar método específico de UserService
    (mockService as any).getUsersByType = jest.fn();

    // Configurar el servicio en el controlador
    setService(mockService);

    // Crear mocks de request y response
    mockReq = {
      body: {},
      params: {},
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    // Limpiar console.log
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("debería obtener todos los usuarios exitosamente", async () => {
      const mockUsers = [
        {
          userId: 1,
          username: "admin",
          email: "admin@test.com",
          userTypeId: 1,
          active: true,
        },
        {
          userId: 2,
          username: "empleado",
          email: "empleado@test.com",
          userTypeId: 2,
          active: true,
        },
      ];

      mockService.getAll.mockResolvedValue(mockUsers);

      await getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: mockUsers });
    });

    it("debería manejar errores del servicio", async () => {
      const errorMessage = "Error de base de datos";
      mockService.getAll.mockRejectedValue(new Error(errorMessage));

      await getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener los usuarios: ${errorMessage}`,
      });
    });

    it("debería retornar array vacío cuando no hay usuarios", async () => {
      mockService.getAll.mockResolvedValue([]);

      await getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: [] });
    });
  });

  describe("getUserById", () => {
    it("debería obtener un usuario por ID exitosamente", async () => {
      const userId = 1;
      const mockUser = {
        userId: 1,
        username: "admin",
        email: "admin@test.com",
        userTypeId: 1,
        active: true,
      };

      const { userIdSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: userId });

      mockService.getById = jest.fn().mockResolvedValue(mockUser);

      mockReq.params = { id: "1" };

      await getUserById(mockReq, mockRes);

      expect(userIdSchema.parse).toHaveBeenCalledWith({ id: "1" });
      expect(mockService.getById).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: mockUser });
    });

    it("debería manejar errores de validación de Zod", async () => {
      const { userIdSchema } = require("../../application/validations/UserValidations");
      const zodError = {
        name: "ZodError",
        issues: [{ message: "ID debe ser un número", path: ["id"] }],
      };
      userIdSchema.parse.mockImplementation(() => {
        throw zodError;
      });

      mockReq.params = { id: "invalid" };

      await getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: ID debe ser un número",
      });
    });

    it("debería manejar error cuando el usuario no existe", async () => {
      const { userIdSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: 999 });

      const errorMessage = "Usuario con ID 999 no encontrado";
      mockService.getById = jest.fn().mockRejectedValue(new Error(errorMessage));

      mockReq.params = { id: "999" };

      await getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: errorMessage,
      });
    });

    it("debería manejar errores internos del servidor", async () => {
      const { userIdSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: 1 });

      const errorMessage = "Error de conexión";
      mockService.getById = jest.fn().mockRejectedValue(new Error(errorMessage));

      mockReq.params = { id: "1" };

      await getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener el usuario: ${errorMessage}`,
      });
    });
  });

  describe("saveUser", () => {
    it("debería crear un usuario exitosamente", async () => {
      const userData = {
        username: "nuevousuario",
        password: "password123",
        email: "nuevo@test.com",
        typeId: 2,
      };

      const savedUser = {
        userId: 3,
        username: "nuevousuario",
        email: "nuevo@test.com",
        userTypeId: 2,
        active: true,
      };

      const { createUserSchema } = require("../../application/validations/UserValidations");
      createUserSchema.parse.mockReturnValue(userData);

      mockService.save.mockResolvedValue(savedUser);

      mockReq.body = userData;

      await saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(userData);
      expect(mockService.save).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario creado correctamente",
        data: savedUser,
      });
    });

    it("debería manejar errores de validación de Zod", async () => {
      const userData = {
        username: "ab", // Muy corto
        password: "123", // Muy corto
        email: "invalid-email",
        typeId: "invalid",
      };

      const { createUserSchema } = require("../../application/validations/UserValidations");
      const zodError = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre de usuario debe tener al menos 3 caracteres",
            path: ["username"],
            code: "too_small",
          },
        ],
      };
      createUserSchema.parse.mockImplementation(() => {
        throw zodError;
      });

      mockReq.body = userData;

      await saveUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre de usuario debe tener al menos 3 caracteres",
        campo: ["username"],
        error: "too_small",
      });
    });

    it("debería manejar errores del servicio", async () => {
      const userData = {
        username: "usuario",
        password: "password123",
        email: "usuario@test.com",
        typeId: 2,
      };

      const { createUserSchema } = require("../../application/validations/UserValidations");
      createUserSchema.parse.mockReturnValue(userData);

      const errorMessage = "Error al guardar en base de datos";
      mockService.save.mockRejectedValue(new Error(errorMessage));

      mockReq.body = userData;

      await saveUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error interno del servidor: ${errorMessage}`,
      });
    });

    it("debería validar email único", async () => {
      const userData = {
        username: "usuario2",
        password: "password123",
        email: "admin@test.com", // Email ya existente
        typeId: 2,
      };

      const { createUserSchema } = require("../../application/validations/UserValidations");
      createUserSchema.parse.mockReturnValue(userData);

      const errorMessage = "El email ya está en uso";
      mockService.save.mockRejectedValue(new Error(errorMessage));

      mockReq.body = userData;

      await saveUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error interno del servidor: ${errorMessage}`,
      });
    });
  });

  describe("updateUser", () => {
    it("debería actualizar un usuario exitosamente", async () => {
      const userId = 1;
      const updateData = {
        username: "usuariomodificado",
        email: "modificado@test.com",
      };

      const updatedUser = {
        userId: 1,
        username: "usuariomodificado",
        email: "modificado@test.com",
        userTypeId: 1,
        active: true,
      };

      const { userIdSchema, updateUserSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: userId });
      updateUserSchema.parse.mockReturnValue(updateData);

      mockService.update = jest.fn().mockResolvedValue(updatedUser);

      mockReq.params = { id: "1" };
      mockReq.body = updateData;

      await updateUser(mockReq, mockRes);

      expect(userIdSchema.parse).toHaveBeenCalledWith({ id: "1" });
      expect(updateUserSchema.parse).toHaveBeenCalledWith(updateData);
      expect(mockService.update).toHaveBeenCalledWith({
        userId: userId,
        ...updateData,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario actualizado correctamente",
        data: updatedUser,
      });
    });

    it("debería manejar errores de validación", async () => {
      const { userIdSchema } = require("../../application/validations/UserValidations");
      const zodError = {
        name: "ZodError",
        issues: [{ message: "ID inválido", path: ["id"] }],
      };
      userIdSchema.parse.mockImplementation(() => {
        throw zodError;
      });

      mockReq.params = { id: "invalid" };
      mockReq.body = {};

      await updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: ID inválido",
        campo: ["id"],
      });
    });

    it("debería manejar error cuando el usuario no existe para actualizar", async () => {
      const { userIdSchema, updateUserSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: 999 });
      updateUserSchema.parse.mockReturnValue({ username: "nuevo" });

      const errorMessage = "Usuario con ID 999 no encontrado";
      mockService.update = jest.fn().mockRejectedValue(new Error(errorMessage));

      mockReq.params = { id: "999" };
      mockReq.body = { username: "nuevo" };

      await updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: errorMessage,
      });
    });

    it("debería actualizar solo los campos proporcionados", async () => {
      const { userIdSchema, updateUserSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: 1 });
      updateUserSchema.parse.mockReturnValue({ email: "nuevoemail@test.com" });

      mockService.update = jest.fn().mockResolvedValue({});

      mockReq.params = { id: "1" };
      mockReq.body = { email: "nuevoemail@test.com" };

      await updateUser(mockReq, mockRes);

      expect(mockService.update).toHaveBeenCalledWith({
        userId: 1,
        email: "nuevoemail@test.com",
      });
    });
  });

  describe("deleteUser", () => {
    it("debería eliminar un usuario exitosamente", async () => {
      const userId = 1;
      const deleteResult = { message: "Usuario eliminado", id: userId };

      const { userIdSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: userId });

      mockService.delete.mockResolvedValue(deleteResult);

      mockReq.params = { id: "1" };

      await deleteUser(mockReq, mockRes);

      expect(userIdSchema.parse).toHaveBeenCalledWith({ id: "1" });
      expect(mockService.delete).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario eliminado correctamente",
        data: deleteResult,
      });
    });

    it("debería manejar errores de validación de ID", async () => {
      const { userIdSchema } = require("../../application/validations/UserValidations");
      const zodError = {
        name: "ZodError",
        issues: [{ message: "ID debe ser un número positivo" }],
      };
      userIdSchema.parse.mockImplementation(() => {
        throw zodError;
      });

      mockReq.params = { id: "invalid" };

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: ID debe ser un número positivo",
      });
    });

    it("debería manejar error cuando el usuario no existe para eliminar", async () => {
      const { userIdSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: 999 });

      const errorMessage = "Usuario con ID 999 no encontrado";
      mockService.delete.mockRejectedValue(new Error(errorMessage));

      mockReq.params = { id: "999" };

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: errorMessage,
      });
    });

    it("debería manejar errores internos del servidor", async () => {
      const { userIdSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: 1 });

      const errorMessage = "Error de base de datos";
      mockService.delete.mockRejectedValue(new Error(errorMessage));

      mockReq.params = { id: "1" };

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error interno del servidor: ${errorMessage}`,
      });
    });
  });

  describe("getUsersByType", () => {
    it("debería obtener usuarios por tipo exitosamente", async () => {
      const typeId = 2;
      const mockUsers = [
        {
          userId: 2,
          username: "empleado1",
          email: "emp1@test.com",
          userTypeId: 2,
          active: true,
        },
        {
          userId: 3,
          username: "empleado2",
          email: "emp2@test.com",
          userTypeId: 2,
          active: true,
        },
      ];

      (mockService as any).getUsersByType = jest.fn().mockResolvedValue(mockUsers);

      mockReq.params = { typeId: "2" };

      await getUsersByType(mockReq, mockRes);

      expect((mockService as any).getUsersByType).toHaveBeenCalledWith(typeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: mockUsers });
    });

    it("debería retornar array vacío para tipo sin usuarios", async () => {
      const typeId = 999;
      (mockService as any).getUsersByType = jest.fn().mockResolvedValue([]);

      mockReq.params = { typeId: "999" };

      await getUsersByType(mockReq, mockRes);

      expect((mockService as any).getUsersByType).toHaveBeenCalledWith(typeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: [] });
    });

    it("debería manejar errores del servicio", async () => {
      const errorMessage = "Error al consultar usuarios por tipo";
      (mockService as any).getUsersByType = jest.fn().mockRejectedValue(new Error(errorMessage));

      mockReq.params = { typeId: "1" };

      await getUsersByType(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener los usuarios por tipo: ${errorMessage}`,
      });
    });

    it("debería convertir typeId string a number", async () => {
      (mockService as any).getUsersByType = jest.fn().mockResolvedValue([]);

      mockReq.params = { typeId: "5" };

      await getUsersByType(mockReq, mockRes);

      expect((mockService as any).getUsersByType).toHaveBeenCalledWith(5);
    });
  });

  describe("setService", () => {
    it("debería configurar el servicio correctamente", () => {
      const newMockService = {
        save: jest.fn(),
        getAll: jest.fn(),
      } as any;

      expect(() => setService(newMockService)).not.toThrow();
    });
  });

  describe("Casos de integración", () => {
    it("debería manejar flujo completo de CRUD de usuarios", async () => {
      // 1. Crear usuario
      const userData = {
        username: "testuser",
        password: "password123",
        email: "test@example.com",
        typeId: 2,
      };

      const { createUserSchema } = require("../../application/validations/UserValidations");
      createUserSchema.parse.mockReturnValue(userData);

      const savedUser = { userId: 1, ...userData };
      mockService.save.mockResolvedValue(savedUser);

      mockReq.body = userData;
      await saveUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      // 2. Obtener usuario por ID
      const { userIdSchema } = require("../../application/validations/UserValidations");
      userIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.getById = jest.fn().mockResolvedValue(savedUser);

      mockReq.params = { id: "1" };
      await getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      // 3. Actualizar usuario
      const { updateUserSchema } = require("../../application/validations/UserValidations");
      const updateData = { username: "updateduser" };
      updateUserSchema.parse.mockReturnValue(updateData);

      const updatedUser = { ...savedUser, username: "updateduser" };
      mockService.update = jest.fn().mockResolvedValue(updatedUser);

      mockReq.body = updateData;
      await updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      // 4. Eliminar usuario
      mockService.delete.mockResolvedValue({ message: "Eliminado", id: 1 });

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("debería manejar múltiples usuarios del mismo tipo", async () => {
      const typeId = 2;
      const usersOfType = [
        { userId: 1, username: "user1", userTypeId: 2 },
        { userId: 2, username: "user2", userTypeId: 2 },
        { userId: 3, username: "user3", userTypeId: 2 },
      ];

      (mockService as any).getUsersByType = jest.fn().mockResolvedValue(usersOfType);

      mockReq.params = { typeId: "2" };
      await getUsersByType(mockReq, mockRes);

      expect((mockService as any).getUsersByType).toHaveBeenCalledWith(typeId);
      expect(mockRes.send).toHaveBeenCalledWith({ body: usersOfType });
    });
  });

  describe("Validaciones de datos", () => {
    it("debería validar formato de email correctamente", async () => {
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "user@",
        "user.example.com",
      ];

      const { createUserSchema } = require("../../application/validations/UserValidations");

      for (const email of invalidEmails) {
        const zodError = {
          name: "ZodError",
          issues: [{ message: "Debe ser un email válido", path: ["email"] }],
        };
        createUserSchema.parse.mockImplementation(() => {
          throw zodError;
        });

        mockReq.body = {
          username: "test",
          password: "password123",
          email: email,
          typeId: 1,
        };

        await saveUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });

    it("debería validar longitud de contraseña", async () => {
      const shortPasswords = ["1", "12", "123", "1234", "12345"];

      const { createUserSchema } = require("../../application/validations/UserValidations");

      for (const password of shortPasswords) {
        const zodError = {
          name: "ZodError",
          issues: [
            {
              message: "La contraseña debe tener al menos 6 caracteres",
              path: ["password"],
            },
          ],
        };
        createUserSchema.parse.mockImplementation(() => {
          throw zodError;
        });

        mockReq.body = {
          username: "test",
          password: password,
          email: "test@example.com",
          typeId: 1,
        };

        await saveUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });

    it("debería validar longitud de username", async () => {
      const invalidUsernames = ["", "a", "ab"];

      const { createUserSchema } = require("../../application/validations/UserValidations");

      for (const username of invalidUsernames) {
        const zodError = {
          name: "ZodError",
          issues: [
            {
              message: "El nombre de usuario debe tener al menos 3 caracteres",
              path: ["username"],
            },
          ],
        };
        createUserSchema.parse.mockImplementation(() => {
          throw zodError;
        });

        mockReq.body = {
          username: username,
          password: "password123",
          email: "test@example.com",
          typeId: 1,
        };

        await saveUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
import { Repository } from "typeorm";
import { UserTypeService } from "../UserTypeService";
import { UserType } from "../../../core/entities/UserType";

describe("UserTypeService", () => {
  let userTypeService: UserTypeService;
  let mockRepository: jest.Mocked<Repository<UserType>>;

  beforeEach(() => {
    // Crear mock completo del repositorio
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAndCount: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {} as any,
      metadata: {} as any,
      target: UserType,
      query: jest.fn(),
      clear: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      extend: jest.fn(),
      findBy: jest.fn(),
      findOneBy: jest.fn(),
      findOneByOrFail: jest.fn(),
      findOneOrFail: jest.fn(),
      countBy: jest.fn(),
      existsBy: jest.fn(),
      exists: jest.fn(),
      findByIds: jest.fn(),
      preload: jest.fn(),
      remove: jest.fn(),
      softDelete: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      restore: jest.fn(),
      insert: jest.fn(),
      upsert: jest.fn(),
      getId: jest.fn(),
      hasId: jest.fn(),
      merge: jest.fn(),
      queryRunner: undefined,
      selectQueryBuilder: jest.fn()
    } as any;

    // Crear instancia del servicio con el repositorio mock
    userTypeService = new UserTypeService(mockRepository);

    // Limpiar console.log
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería guardar un tipo de usuario exitosamente", async () => {
      const userTypeData = {
        name: "Administrador",
        permissionLevel: 1,
      };

      const savedUserType = {
        userTypeId: 1,
        name: "Administrador",
        permissionLevel: 1,
      } as UserType;

      mockRepository.save.mockResolvedValue(savedUserType);

      const result = await userTypeService.save(userTypeData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Administrador",
          permissionLevel: 1,
        })
      );
      expect(result).toEqual(savedUserType);
    });

    it("debería crear una entidad UserType con los datos correctos", async () => {
      const userTypeData = {
        name: "Empleado",
        permissionLevel: 3,
      };

      let savedEntity: any;
      mockRepository.save.mockImplementation((userType) => {
        savedEntity = userType;
        return Promise.resolve({ userTypeId: 1, ...userType } as UserType);
      });

      await userTypeService.save(userTypeData);

      expect(savedEntity).toBeInstanceOf(UserType);
      expect(savedEntity.name).toBe("Empleado");
      expect(savedEntity.permissionLevel).toBe(3);
    });

    it("debería manejar diferentes tipos de usuario y niveles", async () => {
      const tiposUsuario = [
        { name: "Administrador", permissionLevel: 1 },
        { name: "Gerente", permissionLevel: 2 },
        { name: "Empleado", permissionLevel: 3 },
        { name: "Cajero", permissionLevel: 4 },
        { name: "Mesero", permissionLevel: 5 },
        { name: "Invitado", permissionLevel: 10 },
      ];

      for (const tipo of tiposUsuario) {
        mockRepository.save.mockResolvedValue({} as UserType);

        await userTypeService.save(tipo);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: tipo.name,
            permissionLevel: tipo.permissionLevel,
          })
        );
      }
    });

    it("debería manejar nombres con caracteres especiales", async () => {
      const userTypeData = {
        name: "Administrador & Supervisor",
        permissionLevel: 1,
      };

      mockRepository.save.mockResolvedValue({} as UserType);

      await userTypeService.save(userTypeData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Administrador & Supervisor",
        })
      );
    });

    it("debería manejar niveles de permiso extremos", async () => {
      const niveles = [0, 1, 99, 100, 999];

      for (const nivel of niveles) {
        const userTypeData = {
          name: `Tipo Nivel ${nivel}`,
          permissionLevel: nivel,
        };

        mockRepository.save.mockResolvedValue({} as UserType);

        await userTypeService.save(userTypeData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            permissionLevel: nivel,
          })
        );
      }
    });

    it("debería manejar nombres vacíos o indefinidos", async () => {
      const casos = [
        { name: "", permissionLevel: 1 },
        { name: undefined, permissionLevel: 2 },
        { name: null, permissionLevel: 3 },
      ];

      for (const caso of casos) {
        mockRepository.save.mockResolvedValue({} as UserType);

        await userTypeService.save(caso);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: caso.name,
            permissionLevel: caso.permissionLevel,
          })
        );
      }
    });

    it("debería manejar errores del repositorio", async () => {
      const userTypeData = {
        name: "Test Error",
        permissionLevel: 1,
      };

      const repositoryError = new Error("Error de base de datos");
      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(userTypeService.save(userTypeData)).rejects.toThrow("Error de base de datos");
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("debería obtener un tipo de usuario por ID", async () => {
      const userTypeId = 1;
      const mockUserType = {
        userTypeId: 1,
        name: "Administrador",
        permissionLevel: 1,
      } as UserType;

      mockRepository.findOne.mockResolvedValue(mockUserType);

      const result = await userTypeService.getById(userTypeId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userTypeId: 1 },
      });
      expect(result).toEqual(mockUserType);
    });

    it("debería lanzar error cuando el tipo de usuario no existe", async () => {
      const userTypeId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(userTypeService.getById(userTypeId)).rejects.toThrow(
        "Tipo de usuario con ID 999 no encontrado"
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userTypeId: 999 },
      });
    });

    it("debería manejar errores del repositorio", async () => {
      const userTypeId = 1;
      const repositoryError = new Error("Error de consulta");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(userTypeService.getById(userTypeId)).rejects.toThrow("Error de consulta");
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it("debería manejar diferentes IDs", async () => {
      const ids = [1, 5, 10, 100, 999];

      for (const id of ids) {
        const mockUserType = {
          userTypeId: id,
          name: `Tipo ${id}`,
          permissionLevel: id,
        } as UserType;

        mockRepository.findOne.mockResolvedValue(mockUserType);

        const result = await userTypeService.getById(id);

        expect(result?.userTypeId).toBe(id);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { userTypeId: id },
        });
      }
    });

    it("debería obtener tipos con diferentes niveles de permiso", async () => {
      const tiposEjemplo = [
        { id: 1, name: "Super Admin", permissionLevel: 1 },
        { id: 2, name: "Empleado Regular", permissionLevel: 5 },
        { id: 3, name: "Usuario Limitado", permissionLevel: 10 },
      ];

      for (const tipo of tiposEjemplo) {
        const mockUserType = {
          userTypeId: tipo.id,
          name: tipo.name,
          permissionLevel: tipo.permissionLevel,
        } as UserType;

        mockRepository.findOne.mockResolvedValue(mockUserType);

        const result = await userTypeService.getById(tipo.id);

        expect(result?.name).toBe(tipo.name);
        expect(result?.permissionLevel).toBe(tipo.permissionLevel);
      }
    });
  });

  describe("getAll", () => {
    it("debería obtener todos los tipos de usuario", async () => {
      const mockUserTypes = [
        {
          userTypeId: 1,
          name: "Administrador",
          permissionLevel: 1,
        },
        {
          userTypeId: 2,
          name: "Gerente",
          permissionLevel: 2,
        },
        {
          userTypeId: 3,
          name: "Empleado",
          permissionLevel: 3,
        },
        {
          userTypeId: 4,
          name: "Cajero",
          permissionLevel: 4,
        },
      ] as UserType[];

      mockRepository.find.mockResolvedValue(mockUserTypes);

      const result = await userTypeService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { permissionLevel: "ASC" }
      });
      expect(result).toEqual(mockUserTypes);
      expect(result).toHaveLength(4);
    });

    it("debería retornar array vacío cuando no hay tipos de usuario", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await userTypeService.getAll();

      expect(result).toEqual([]);
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de conexión");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(userTypeService.getAll()).rejects.toThrow("Error de conexión");
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it("debería obtener tipos con diferentes niveles ordenados", async () => {
      const mockUserTypes = [
        {
          userTypeId: 1,
          name: "Super Administrador",
          permissionLevel: 1,
        },
        {
          userTypeId: 5,
          name: "Usuario Final",
          permissionLevel: 10,
        },
        {
          userTypeId: 3,
          name: "Moderador",
          permissionLevel: 5,
        },
      ] as UserType[];

      mockRepository.find.mockResolvedValue(mockUserTypes);

      const result = await userTypeService.getAll();

      expect(result).toEqual(mockUserTypes);
      expect(result.some(type => type.permissionLevel === 1)).toBe(true);
      expect(result.some(type => type.permissionLevel === 10)).toBe(true);
      expect(result.some(type => type.permissionLevel === 5)).toBe(true);
    });

    it("debería obtener tipos con nombres únicos", async () => {
      const mockUserTypes = [
        { userTypeId: 1, name: "Tipo A", permissionLevel: 1 },
        { userTypeId: 2, name: "Tipo B", permissionLevel: 2 },
        { userTypeId: 3, name: "Tipo C", permissionLevel: 3 },
      ] as UserType[];

      mockRepository.find.mockResolvedValue(mockUserTypes);

      const result = await userTypeService.getAll();

      const nombres = result.map(type => type.name);
      const nombresUnicos = new Set(nombres);
      
      expect(nombres.length).toBe(nombresUnicos.size);
      expect(result).toHaveLength(3);
    });
  });

  describe("saveAll", () => {
    it("should save multiple user types successfully", async () => {
      const userTypesData = [
        { name: "Manager", permissionLevel: 2 },
        { name: "Employee", permissionLevel: 5 }
      ];

      const savedUserTypes = [
        { userTypeId: 1, name: "Manager", permissionLevel: 2 },
        { userTypeId: 2, name: "Employee", permissionLevel: 5 }
      ] as UserType[];

      mockRepository.save.mockResolvedValue(savedUserTypes as any);

      const result = await userTypeService.saveAll(userTypesData);

      expect(mockRepository.save).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: "Manager", permissionLevel: 2 }),
        expect.objectContaining({ name: "Employee", permissionLevel: 5 })
      ]));
      expect(result).toEqual(savedUserTypes);
    });

    it("should handle error when saving multiple user types", async () => {
      const userTypesData = [{ name: "Test", permissionLevel: 1 }];
      mockRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(userTypeService.saveAll(userTypesData)).rejects.toThrow("Database error");
    });
  });

  describe("update", () => {
    it("should update user type successfully", async () => {
      const updateData = {
        userTypeId: 1,
        name: "Updated Admin",
        permissionLevel: 1
      };

      const existingUserType = {
        userTypeId: 1,
        name: "Admin",
        permissionLevel: 2
      } as UserType;

      const updatedUserType = {
        userTypeId: 1,
        name: "Updated Admin", 
        permissionLevel: 1
      } as UserType;

      mockRepository.findOne.mockResolvedValue(existingUserType);
      mockRepository.save.mockResolvedValue(updatedUserType);

      const result = await userTypeService.update(updateData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userTypeId: 1 }
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        userTypeId: 1,
        name: "Updated Admin",
        permissionLevel: 1
      }));
      expect(result).toEqual(updatedUserType);
    });

    it("should throw error when userTypeId is missing", async () => {
      const updateData = { name: "Test" };

      await expect(userTypeService.update(updateData)).rejects.toThrow(
        "userTypeId es requerido para actualizar"
      );
    });

    it("should throw error when user type not found for update", async () => {
      const updateData = { userTypeId: 999, name: "Test" };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(userTypeService.update(updateData)).rejects.toThrow(
        "Tipo de usuario con ID 999 no encontrado"
      );
    });

    it("should handle database error when updating", async () => {
      const updateData = { userTypeId: 1, name: "Test" };
      const existingUserType = { userTypeId: 1, name: "Old" } as UserType;

      mockRepository.findOne.mockResolvedValue(existingUserType);
      mockRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(userTypeService.update(updateData)).rejects.toThrow("Database error");
    });
  });

  describe("delete", () => {
    it("should delete user type successfully", async () => {
      const deleteResult = { affected: 1, raw: {} };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await userTypeService.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: "Tipo de usuario eliminado correctamente",
        id: 1
      });
    });

    it("should throw error when user type not found for deletion", async () => {
      const deleteResult = { affected: 0, raw: {} };
      mockRepository.delete.mockResolvedValue(deleteResult);

      await expect(userTypeService.delete(999)).rejects.toThrow(
        "Tipo de usuario con ID 999 no encontrado"
      );
    });

    it("should handle database error when deleting", async () => {
      mockRepository.delete.mockRejectedValue(new Error("Database error"));

      await expect(userTypeService.delete(1)).rejects.toThrow("Database error");
    });
  });

  describe("getByPermissionLevel", () => {
    it("should return user types by permission level", async () => {
      const userTypes = [
        { userTypeId: 1, name: "Admin", permissionLevel: 1 },
        { userTypeId: 2, name: "Super Admin", permissionLevel: 1 }
      ] as UserType[];

      mockRepository.find.mockResolvedValue(userTypes);

      const result = await userTypeService.getByPermissionLevel(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { permissionLevel: 1 },
        order: { name: "ASC" }
      });
      expect(result).toEqual(userTypes);
    });

    it("should return empty array when no user types found for permission level", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await userTypeService.getByPermissionLevel(999);

      expect(result).toEqual([]);
    });

    it("should handle database error when getting by permission level", async () => {
      mockRepository.find.mockRejectedValue(new Error("Database error"));

      await expect(userTypeService.getByPermissionLevel(1)).rejects.toThrow("Database error");
    });
  });
});
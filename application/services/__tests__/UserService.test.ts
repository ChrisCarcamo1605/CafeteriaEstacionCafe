import { Repository } from "typeorm";
import { UserService } from "../UserService";
import { User } from "../../../core/entities/User";
import { UserType } from "../../../core/entities/UserType";
import { SaveUserDTO } from "../../DTOs/UserDTO";
import * as bcrypt from "bcrypt";

// Mock bcrypt
jest.mock("bcrypt", () => ({
    hash: jest.fn()
}));

describe("UserService", () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<Repository<User>>;
    
    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            findAndCount: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
            manager: {} as any,
            metadata: {} as any,
            target: User,
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

        userService = new UserService(mockUserRepository);
        
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe("save", () => {
        it("should save a user successfully", async () => {
            const userData: SaveUserDTO = {
                username: "testuser",
                password: "password123",
                email: "test@example.com",
                typeId: 1
            };

            const hashedPassword = "hashedPassword123";
            const savedUser = {
                userId: 1,
                username: "testuser",
                password: hashedPassword,
                email: "test@example.com",
                userTypeId: 1,
                active: true
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockUserRepository.save.mockResolvedValue(savedUser as User);

            const result = await userService.save(userData);

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                username: "testuser",
                password: hashedPassword,
                email: "test@example.com",
                userTypeId: 1
            }));
            expect(result).toEqual(savedUser);
        });

        it("should handle error when saving user", async () => {
            const userData: SaveUserDTO = {
                username: "testuser",
                password: "password123", 
                email: "test@example.com",
                typeId: 1
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
            mockUserRepository.save.mockRejectedValue(new Error("Database error"));

            await expect(userService.save(userData)).rejects.toThrow("Database error");
        });
    });

    describe("saveAll", () => {
        it("should save multiple users successfully", async () => {
            const usersData: SaveUserDTO[] = [
                {
                    username: "user1",
                    password: "password1",
                    email: "user1@example.com",
                    typeId: 1
                },
                {
                    username: "user2", 
                    password: "password2",
                    email: "user2@example.com",
                    typeId: 2
                }
            ];

            const hashedPassword = "hashedPassword";
            const savedUsers = [
                {
                    userId: 1,
                    username: "user1",
                    password: hashedPassword,
                    email: "user1@example.com",
                    userTypeId: 1,
                    active: true
                },
                {
                    userId: 2,
                    username: "user2",
                    password: hashedPassword,
                    email: "user2@example.com", 
                    userTypeId: 2,
                    active: true
                }
            ];

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockUserRepository.save.mockResolvedValue(savedUsers as any);

            const result = await userService.saveAll(usersData);

            expect(bcrypt.hash).toHaveBeenCalledTimes(2);
            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    username: "user1",
                    password: hashedPassword,
                    email: "user1@example.com",
                    userTypeId: 1
                }),
                expect.objectContaining({
                    username: "user2",
                    password: hashedPassword,
                    email: "user2@example.com",
                    userTypeId: 2
                })
            ]));
            expect(result).toEqual(savedUsers);
        });

        it("should handle error when saving multiple users", async () => {
            const usersData: SaveUserDTO[] = [
                {
                    username: "user1",
                    password: "password1",
                    email: "user1@example.com",
                    typeId: 1
                }
            ];

            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
            mockUserRepository.save.mockRejectedValue(new Error("Database error"));

            await expect(userService.saveAll(usersData)).rejects.toThrow("Database error");
        });
    });

    describe("getAll", () => {
        it("should return all users with relations", async () => {
            const users = [
                {
                    userId: 1,
                    username: "user1",
                    email: "user1@example.com",
                    userTypeId: 1,
                    active: true,
                    userType: {
                        userTypeId: 1,
                        name: "Administrator",
                        permissionLevel: 10
                    }
                },
                {
                    userId: 2,
                    username: "user2",
                    email: "user2@example.com",
                    userTypeId: 2,
                    active: true,
                    userType: {
                        userTypeId: 2,
                        name: "Employee",
                        permissionLevel: 5
                    }
                }
            ];

            mockUserRepository.find.mockResolvedValue(users as User[]);

            const result = await userService.getAll();

            expect(mockUserRepository.find).toHaveBeenCalledWith({
                relations: ["userType"],
                order: { username: "ASC" }
            });
            expect(result).toEqual(users);
        });

        it("should handle error when getting all users", async () => {
            mockUserRepository.find.mockRejectedValue(new Error("Database error"));

            await expect(userService.getAll()).rejects.toThrow("Database error");
        });
    });

    describe("getById", () => {
        it("should return user by id with relations", async () => {
            const user = {
                userId: 1,
                username: "testuser",
                email: "test@example.com",
                userTypeId: 1,
                active: true,
                userType: {
                    userTypeId: 1,
                    name: "Administrator",
                    permissionLevel: 10
                }
            };

            mockUserRepository.findOne.mockResolvedValue(user as User);

            const result = await userService.getById(1);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { userId: 1 },
                relations: ["userType"]
            });
            expect(result).toEqual(user);
        });

        it("should throw error when user not found", async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(userService.getById(999)).rejects.toThrow("Usuario con ID 999 no encontrado");

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { userId: 999 },
                relations: ["userType"]
            });
        });

        it("should handle database error when getting user by id", async () => {
            mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

            await expect(userService.getById(1)).rejects.toThrow("Database error");
        });
    });

    describe("update", () => {
        it("should update user successfully", async () => {
            const updateData = {
                userId: 1,
                username: "updateduser",
                email: "updated@example.com"
            };

            const existingUser = {
                userId: 1,
                username: "olduser",
                email: "old@example.com",
                password: "oldpassword",
                userTypeId: 1,
                active: true
            };

            const updatedUser = {
                ...existingUser,
                username: "updateduser",
                email: "updated@example.com"
            };

            mockUserRepository.findOne.mockResolvedValue(existingUser as User);
            mockUserRepository.save.mockResolvedValue(updatedUser as User);

            const result = await userService.update(updateData);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { userId: 1 }
            });
            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                userId: 1,
                username: "updateduser", 
                email: "updated@example.com"
            }));
            expect(result).toEqual(updatedUser);
        });

        it("should update user password with encryption", async () => {
            const updateData = {
                userId: 1,
                password: "newpassword123"
            };

            const existingUser = {
                userId: 1,
                username: "testuser",
                email: "test@example.com",
                password: "oldhashedpassword",
                userTypeId: 1,
                active: true
            };

            const hashedNewPassword = "newhashedpassword";
            const updatedUser = {
                ...existingUser,
                password: hashedNewPassword
            };

            mockUserRepository.findOne.mockResolvedValue(existingUser as User);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedNewPassword);
            mockUserRepository.save.mockResolvedValue(updatedUser as User);

            const result = await userService.update(updateData);

            expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                password: hashedNewPassword
            }));
            expect(result).toEqual(updatedUser);
        });

        it("should throw error when userId is missing", async () => {
            const updateData = {
                username: "updateduser"
            };

            await expect(userService.update(updateData)).rejects.toThrow("userId es requerido para actualizar");
        });

        it("should throw error when user not found for update", async () => {
            const updateData = {
                userId: 999,
                username: "updateduser"
            };

            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(userService.update(updateData)).rejects.toThrow("Usuario con ID 999 no encontrado");
        });

        it("should handle database error when updating user", async () => {
            const updateData = {
                userId: 1,
                username: "updateduser"
            };

            const existingUser = {
                userId: 1,
                username: "olduser",
                email: "old@example.com",
                userTypeId: 1,
                active: true
            };

            mockUserRepository.findOne.mockResolvedValue(existingUser as User);
            mockUserRepository.save.mockRejectedValue(new Error("Database error"));

            await expect(userService.update(updateData)).rejects.toThrow("Database error");
        });
    });

    describe("delete", () => {
        it("should deactivate user successfully", async () => {
            const existingUser = {
                userId: 1,
                username: "testuser",
                email: "test@example.com",
                active: true,
                userTypeId: 1
            };

            const deactivatedUser = {
                ...existingUser,
                active: false
            };

            mockUserRepository.findOne.mockResolvedValue(existingUser as User);
            mockUserRepository.save.mockResolvedValue(deactivatedUser as User);

            const result = await userService.delete(1);

            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                active: false
            }));
            expect(result).toEqual({
                message: "Usuario desactivado correctamente",
                id: 1
            });
        });

        it("should handle error when user not found for deletion", async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(userService.delete(999)).rejects.toThrow("Usuario con ID 999 no encontrado");
        });

        it("should handle database error when deleting user", async () => {
            const existingUser = {
                userId: 1,
                username: "testuser",
                email: "test@example.com",
                active: true,
                userTypeId: 1
            };

            mockUserRepository.findOne.mockResolvedValue(existingUser as User);
            mockUserRepository.save.mockRejectedValue(new Error("Database error"));

            await expect(userService.delete(1)).rejects.toThrow("Database error");
        });
    });

    describe("getUsersByType", () => {
        it("should return users by type with relations", async () => {
            const users = [
                {
                    userId: 1,
                    username: "admin1",
                    email: "admin1@example.com",
                    userTypeId: 1,
                    active: true,
                    userType: {
                        userTypeId: 1,
                        name: "Administrator",
                        permissionLevel: 10
                    }
                },
                {
                    userId: 2,
                    username: "admin2",
                    email: "admin2@example.com",
                    userTypeId: 1,
                    active: true,
                    userType: {
                        userTypeId: 1,
                        name: "Administrator",
                        permissionLevel: 10
                    }
                }
            ];

            mockUserRepository.find.mockResolvedValue(users as User[]);

            const result = await userService.getUsersByType(1);

            expect(mockUserRepository.find).toHaveBeenCalledWith({
                where: { userTypeId: 1 },
                relations: ["userType"],
                order: { username: "ASC" }
            });
            expect(result).toEqual(users);
        });

        it("should handle error when getting users by type", async () => {
            mockUserRepository.find.mockRejectedValue(new Error("Database error"));

            await expect(userService.getUsersByType(1)).rejects.toThrow("Database error");
        });
    });

    describe("getUserByUsername", () => {
        it("should return user by username with relations", async () => {
            const user = {
                userId: 1,
                username: "testuser",
                email: "test@example.com",
                userTypeId: 1,
                active: true,
                userType: {
                    userTypeId: 1,
                    name: "Administrator",
                    permissionLevel: 10
                }
            };

            mockUserRepository.findOne.mockResolvedValue(user as User);

            const result = await userService.getUserByUsername("testuser");

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { username: "testuser" },
                relations: ["userType"]
            });
            expect(result).toEqual(user);
        });

        it("should return null when user not found by username", async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await userService.getUserByUsername("nonexistent");

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { username: "nonexistent" },
                relations: ["userType"]
            });
            expect(result).toBeNull();
        });

        it("should handle database error when getting user by username", async () => {
            mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

            await expect(userService.getUserByUsername("testuser")).rejects.toThrow("Database error");
        });
    });
});

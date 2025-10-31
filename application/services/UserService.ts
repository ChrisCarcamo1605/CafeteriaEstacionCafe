import { Repository } from "typeorm";
import { User } from "../../core/entities/User";
import { UserType } from "../../core/entities/UserType";
import { IService } from "../../core/interfaces/IService";
import { SaveUserDTO } from "../DTOs/UserDTO";
import * as bcrypt from "bcrypt";
import { IUserService } from "../../core/interfaces/IUserService";

export class UserService implements IUserService {
  private userRepository: Repository<User>;
  constructor(userRepo: Repository<User>) {
    this.userRepository = userRepo;
  }

  async saveAll(body: SaveUserDTO[]): Promise<User[]> {
    const users = await Promise.all(
      body.map(async (userData) => {
        const user = new User();
        user.username = userData.username;
        user.password = await this.encryptPassword(userData.password);
        user.userTypeId = userData.typeId;
        user.email = userData.email;
        return user;
      })
    );

    return await this.userRepository.save(users);
  }

  async save(body: SaveUserDTO): Promise<any> {
    const userData: SaveUserDTO = body;
    const user: User = new User();
    user.username = userData.username;
    user.password = await this.encryptPassword(userData.password);
    user.userTypeId = userData.typeId;
    user.email = userData.email;

    console.log("Guardando usuario...");
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<any> {
    const user = await this.getById(id);
    user.active = false;

    await this.userRepository.save(user);
    return { message: "Usuario desactivado correctamente", id };
  }

  async update(body: any): Promise<any> {
    const { userId, ...updateData } = body;

    if (!userId) {
      throw new Error("userId es requerido para actualizar");
    }

    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error(`Usuario con ID ${userId} no encontrado`);
    }

    // Si se está actualizando la contraseña, encriptarla
    if (updateData.password) {
      updateData.password = await this.encryptPassword(updateData.password);
    }

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async getAll(): Promise<any[]> {
    console.log(`Obteniendo usuarios...`);
    return this.userRepository.find({
      relations: ["userType"],
      order: { username: "ASC" },
    });
  }

  async getById(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ["userType"],
    });
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async getUsersByType(typeId: number): Promise<User[]> {
    return await this.userRepository.find({
      where: { userTypeId: typeId },
      relations: ["userType"],
      order: { username: "ASC" },
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ["userType"],
    });
  }

  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async getPassword(username: string): Promise<string | null> {
    const user = await this.userRepository.findOne({
      select: { password: true },
      where: { username},
    });
    return user?.password || null;
  }
}

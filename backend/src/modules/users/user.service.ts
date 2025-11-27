import { User } from "./user.model";
import bcrypt from "bcryptjs";

class UserService {
  private users: User[] = [];

  async createUser(data: Omit<User, "id" | "createdAt">) {
    const hashed = await bcrypt.hash(data.password, 10);

    const user: User = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...data,
      password: hashed
    };

    this.users.push(user);
    return user;
  }

  findByEmail(email: string) {
    return this.users.find(u => u.email === email);
  }

  findById(id: string) {
    return this.users.find(u => u.id === id);
  }

  getAll() {
    return this.users;
  }
}

export const userService = new UserService();

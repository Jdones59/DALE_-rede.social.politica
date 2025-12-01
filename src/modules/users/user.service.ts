import bcrypt from "bcrypt";
import crypto from 'crypto';

// Minimal User type for the in-memory user service
interface User {
  id: string | number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

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
    return this.users.find(u => String(u.id) === String(id));
  }

  getAll() {
    return this.users;
  }

  // update profile fields (simple in-memory impl)
  updateProfile(id: string | number, data: { name?: string }) {
    const uid = String(id);
    const user = this.users.find(u => String(u.id) === uid);
    if (!user) return null;
    if (data.name !== undefined) user.name = data.name;
    return user;
  }

  listAll() {
    return this.getAll();
  }
}

export const userService = new UserService();

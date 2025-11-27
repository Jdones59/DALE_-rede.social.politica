import UserModel from "../users/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const userExists = await UserModel.findOne({ email: data.email });
    if (userExists) throw new Error("Email já está em uso");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await UserModel.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      message: "Usuário criado com sucesso",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Credenciais inválidas");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

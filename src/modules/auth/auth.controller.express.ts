import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prismaClient';

export default class AuthControllerExpress {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return res.status(409).json({ error: 'Email já cadastrado' });

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { email, password: hashed, name } });

      const secret = process.env.JWT_SECRET || 'dev-secret';
      const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '7d' });

      return res.status(201).json({ user: { id: user.id, email: user.email }, token });
    } catch (err: any) {
      console.error('Erro em auth.register (express):', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

      const secret = process.env.JWT_SECRET || 'dev-secret';
      const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '7d' });

      return res.json({ user: { id: user.id, email: user.email }, token });
    } catch (err: any) {
      console.error('Erro em auth.login (express):', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async me(req: Request & { user?: any }, res: Response) {
    try {
      const uid = req.user?.sub ?? req.user?.id ?? req.user?.email;
      if (!uid) return res.status(400).json({ error: 'Token inválido' });

      const user = typeof uid === 'number' || /^[0-9]+$/.test(String(uid)) ?
        await prisma.user.findUnique({ where: { id: Number(uid) } }) :
        await prisma.user.findUnique({ where: { email: String(uid) } });

      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      return res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });
    } catch (err: any) {
      console.error('Erro em auth.me (express):', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}

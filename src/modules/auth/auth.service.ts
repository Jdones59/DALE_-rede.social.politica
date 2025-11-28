import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: { email: string; password: string; name?: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email já cadastrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name },
    });

    return this.buildAuthResponse(user.id, user.email);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Usuário ou senha inválidos');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Usuário ou senha inválidos');

    return this.buildAuthResponse(user.id, user.email);
  }

  private buildAuthResponse(id: number, email: string) {
    const payload = { sub: id, email };
    return {
      user: { id, email },
      token: this.jwt.sign(payload),
    };
  }

  async validateUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

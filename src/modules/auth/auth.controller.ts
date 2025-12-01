import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTOs/register.dto';
import { LoginDto } from './DTOs/login.dto';
import { JwtAuthGuard } from './jwt.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
	return this.auth.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
	return this.auth.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
	const id = req.user?.sub ?? req.user?.id;
	return this.auth.validateUserById(Number(id));
  }
}


import { Controller, Get, Req, UseGuards, Patch, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    // dependendo do validate, req.user pode conter id ou sub
    const id = req.user?.id ?? req.user?.sub;
    return this.userService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: { name?: string }) {
    const id = req.user?.id ?? req.user?.sub;
    return this.userService.updateProfile(Number(id), body);
  }

  @Get()
  async list() {
    return this.userService.listAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.findById(Number(id));
  }
}

import { Controller, Get, Req, UseGuards, Patch, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { userService } from './user.service';

@Controller('users')
export class UserController {
  // Using simple exported instance `userService` from user.service.ts
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any): Promise<any> {
    // dependendo do validate, req.user pode conter id ou sub
    const id = req.user?.id ?? req.user?.sub;
    return userService.findById(String(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: { name?: string }): Promise<any> {
    const id = req.user?.id ?? req.user?.sub;
    return userService.updateProfile(String(id), body);
  }

  @Get()
  async list(): Promise<any> {
    return userService.listAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    return userService.findById(String(id));
  }
}

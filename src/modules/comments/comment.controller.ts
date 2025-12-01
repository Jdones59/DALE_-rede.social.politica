import { Controller, Post, Body, Param, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';


@Controller('comments')
export class CommentController {
constructor(private readonly service: CommentService) {}


@UseGuards(JwtAuthGuard)
@Post(':lawId')
create(@Req() req: any, @Param('lawId') lawId: string, @Body('content') content: string) {
	return this.service.createComment(req.user.id, lawId, content);
}


@UseGuards(JwtAuthGuard)
@Delete(':id')
delete(@Req() req: any, @Param('id') id: string) {
	return this.service.deleteComment(req.user.id, id);
}


@Get('law/:lawId')
list(@Param('lawId') lawId: string) {
return this.service.listCommentsByLaw(lawId);
}
}
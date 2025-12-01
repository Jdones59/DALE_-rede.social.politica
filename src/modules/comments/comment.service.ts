import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import DatabaseService from '../../config/database';


@Injectable()
export class CommentService {
constructor(private readonly db: DatabaseService) {}


async createComment(userId: string | number, lawId: string | number, content: string) {
	const uid = Number(userId);
	const lid = Number(lawId);
	if (!Number.isFinite(uid)) throw new Error('Invalid user id');
	if (!Number.isFinite(lid)) throw new Error('Invalid law id');

	const law = await this.db.law.findUnique({ where: { id: lid } });
if (!law) throw new NotFoundException('Lei não encontrada');


	return this.db.comment.create({
		data: {
			userId: uid,
			lawId: lid,
			content,
		},
	});
}


async deleteComment(userId: string | number, commentId: string | number) {
	const uid = Number(userId);
	const cid = Number(commentId);
	if (!Number.isFinite(uid)) throw new Error('Invalid user id');
	if (!Number.isFinite(cid)) throw new Error('Invalid comment id');

	const comment = await this.db.comment.findUnique({ where: { id: cid } });


if (!comment) throw new NotFoundException('Comentário não encontrado');
	if (comment.userId !== uid)
throw new ForbiddenException('Você não pode excluir este comentário');


	return this.db.comment.delete({ where: { id: cid } });
}


async listCommentsByLaw(lawId: string | number) {
	const lid = Number(lawId);
	if (!Number.isFinite(lid)) throw new Error('Invalid law id');

	return this.db.comment.findMany({
		where: { lawId: lid },
orderBy: { createdAt: 'desc' },
include: { user: true }
	});
}
}


import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import AppModule from './app.module';

// Import existing express routers so we can mount them on the underlying express instance.
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import lawRoutes from './modules/laws/law.routes';
import debateRoutes from './modules/debates/debate.routes';
import commentRoutes from './modules/comments/comment.routes';
import friendshipRoutes from './modules/friendship/friendship.routes';
import voteRoutes from './modules/votes/vote.routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mount existing Express routers on the underlying express instance.
  const server = app.getHttpAdapter().getInstance();

  server.use('/auth', authRoutes);
  server.use('/users', userRoutes);
  // keep Portuguese route name for compatibility with the frontend
  server.use('/leis', lawRoutes);
  server.use('/debates', debateRoutes);
  server.use('/comments', commentRoutes);
  server.use('/friendships', friendshipRoutes);
  server.use('/votes', voteRoutes);

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;

  await app.listen(port);
  Logger.log(`🚀 NestJS backend listening on port ${port}`);
}

bootstrap().catch((err) => {
  // Keep a visible error log if bootstrap fails
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap Nest application', err);
  process.exit(1);
});

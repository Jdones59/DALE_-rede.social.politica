import { Module } from '@nestjs/common';
import DatabaseService from './config/database';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}

export default AppModule;

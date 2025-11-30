import { Module } from '@nestjs/common';
import { ComplainService } from './complain.service';
import { ComplainController } from './complain.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ComplainService],
  controllers: [ComplainController],
})
export class ComplainModule {}

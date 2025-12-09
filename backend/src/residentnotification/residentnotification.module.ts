import { Module } from '@nestjs/common';
import { ResidentnotificationController } from './residentnotification.controller';
import { ResidentnotificationService } from './residentnotification.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResidentnotificationController],
  providers: [ResidentnotificationService],
})
export class ResidentnotificationModule {}

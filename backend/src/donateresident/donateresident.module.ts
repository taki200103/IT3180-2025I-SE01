import { Module } from '@nestjs/common';
import { DonateresidentService } from './donateresident.service';
import { DonateresidentController } from './donateresident.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DonateresidentController],
  providers: [DonateresidentService],
  exports: [DonateresidentService],
})
export class DonateresidentModule {}

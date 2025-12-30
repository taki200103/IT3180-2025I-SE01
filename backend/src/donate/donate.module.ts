import { Module } from '@nestjs/common';
import { DonateController } from './donate.controller';
import { DonateService } from './donate.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DonateController],
  providers: [DonateService],
  exports: [DonateService],
})
export class DonateModule {}

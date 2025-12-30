import { Test, TestingModule } from '@nestjs/testing';
import { DonateresidentController } from './donateresident.controller';

describe('DonateresidentController', () => {
  let controller: DonateresidentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonateresidentController],
    }).compile();

    controller = module.get<DonateresidentController>(DonateresidentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ResidentnotificationController } from './residentnotification.controller';

describe('ResidentnotificationController', () => {
  let controller: ResidentnotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResidentnotificationController],
    }).compile();

    controller = module.get<ResidentnotificationController>(
      ResidentnotificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

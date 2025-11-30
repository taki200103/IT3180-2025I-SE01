import { Test, TestingModule } from '@nestjs/testing';
import { ResidentnotificationService } from './residentnotification.service';

describe('ResidentnotificationService', () => {
  let service: ResidentnotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResidentnotificationService],
    }).compile();

    service = module.get<ResidentnotificationService>(
      ResidentnotificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

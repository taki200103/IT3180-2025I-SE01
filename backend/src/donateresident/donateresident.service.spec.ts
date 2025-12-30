import { Test, TestingModule } from '@nestjs/testing';
import { DonateresidentService } from './donateresident.service';

describe('DonateresidentService', () => {
  let service: DonateresidentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonateresidentService],
    }).compile();

    service = module.get<DonateresidentService>(DonateresidentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

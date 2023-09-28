import { Test, TestingModule } from '@nestjs/testing';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';

describe('DmController', () => {
  let controller: DmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DmController],
      providers: [DmService],
    }).compile();

    controller = module.get<DmController>(DmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

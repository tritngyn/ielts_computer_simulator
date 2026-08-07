import { Controller, Get, Param } from '@nestjs/common';
import { TestsService } from './tests.service';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get('reading')
  getAllReadingTests() {
    return this.testsService.getAllReadingTests();
  }

  @Get('reading/:id')
  getReadingTestById(@Param('id') id: string) {
    return this.testsService.getReadingTestById(id);
  }

  @Get('listening')
  getAllListeningTests() {
    return this.testsService.getAllListeningTests();
  }

  @Get('listening/:id')
  getListeningTestById(@Param('id') id: string) {
    return this.testsService.getListeningTestById(id);
  }
}

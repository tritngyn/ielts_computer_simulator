import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { TestsService } from './tests.service';

@Controller('api/v1/tests')
export class TestsV1Controller {
  constructor(private readonly testsService: TestsService) {}

  @Get('reading')
  getAllReadingTests(@Query() query: PaginationQueryDto) {
    return this.testsService.getAllTestsPage('READING', query);
  }

  @Get('reading/:id')
  getReadingTestById(@Param('id') id: string) {
    return this.testsService.getReadingTestById(id);
  }

  @Get('listening')
  getAllListeningTests(@Query() query: PaginationQueryDto) {
    return this.testsService.getAllTestsPage('LISTENING', query);
  }

  @Get('listening/:id')
  getListeningTestById(@Param('id') id: string) {
    return this.testsService.getListeningTestById(id);
  }
}

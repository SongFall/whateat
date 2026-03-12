import { Controller, Get, Param } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  test() {
    return { message: 'Test route works!' };
  }

  @Get(':id/articles')
  testArticles(@Param('id') id: string) {
    return { message: `Test articles route works for user ${id}!` };
  }
}
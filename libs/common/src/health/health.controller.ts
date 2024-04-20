import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthController {
  @Get()
  health() {
    return true;
  }
  @Get('/livez')
  livez() {
    return true;
  }
  @Get('/readyz')
  readyz() {
    return true;
  }
}

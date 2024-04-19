import { Module } from '@nestjs/common';
import { HealthController } from '@app/common/health/health.controller';

@Module({
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}

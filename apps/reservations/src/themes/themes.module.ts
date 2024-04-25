import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ThemeDocument, ThemeEntity } from './models/theme.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ThemeDocument.name, schema: ThemeEntity },
    ]),
    LoggerModule,
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}

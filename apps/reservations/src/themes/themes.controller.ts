import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { JwtAuthGuard, Roles } from '@app/common';

@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  create(@Body() createThemeDto: CreateThemeDto) {
    return this.themesService.create(createThemeDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  findAll() {
    return this.themesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.themesService.findThemeById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateThemeDto: UpdateThemeDto,
  ) {
    return this.themesService.update(id, updateThemeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.themesService.remove(id);
  }
}

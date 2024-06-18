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
  Query,
} from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { JwtAuthGuard, Roles } from '@app/common';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  @Get()
  async findAll(
    @Query('themeId', ParseIntPipe) themeId: number,
    @Query('date') date: Date,
  ) {
    return this.slotsService.findAll(themeId, date);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.slotsService.findSlotById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    return this.slotsService.update(id, updateSlotDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.slotsService.remove(id);
  }
}

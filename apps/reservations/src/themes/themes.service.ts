import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Themes } from './models/themes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Themes)
    private themesRepository: Repository<Themes>,
  ) {}
  create(createThemeDto: CreateThemeDto) {
    const theme = this.themesRepository.create({
      ...createThemeDto,
    });
    const newTheme = this.themesRepository.save(theme);
    return newTheme;
  }

  async findAll() {
    const themes = await this.themesRepository.find();
    return themes;
  }

  async findOne(id: number) {
    const theme = await this.themesRepository.findOne({
      where: {
        id,
      },
    });
    return theme;
  }

  async update(id: number, updateThemeDto: UpdateThemeDto) {
    const theme = await this.themesRepository.findOne({
      where: {
        id,
      },
    });
    if (!theme) {
      throw new NotFoundException(`Theme not found with id: ${id}`);
    }
    const updatedTheme = await this.themesRepository.save({
      ...theme,
      ...updateThemeDto,
    });
    return updatedTheme;
  }

  async remove(id: number) {
    const theme = await this.themesRepository.findOne({
      where: {
        id,
      },
    });
    if (!theme) {
      throw new NotFoundException(`Theme not found with id: ${id}`);
    }
    await this.themesRepository.remove(theme);
    return id;
  }
}

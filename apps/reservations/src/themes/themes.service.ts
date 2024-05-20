import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findThemeById(id: number): Promise<Themes> {
    const theme = await this.themesRepository.findOne({ where: { id } });
    this.notFoundExceptionIfNotExists(theme, `Theme not found with id: ${id}`);
    return theme;
  }

  create(createThemeDto: CreateThemeDto) {
    const theme = this.themesRepository.create({
      ...createThemeDto,
    });
    return this.themesRepository.save(theme);
  }

  async findAll() {
    const themes = await this.themesRepository.find();
    return themes;
  }

  async update(id: number, updateThemeDto: UpdateThemeDto) {
    const theme = await this.findThemeById(id);
    const updatedTheme = await this.themesRepository.save({
      ...theme,
      ...updateThemeDto,
    });
    return updatedTheme;
  }

  async remove(id: number) {
    const theme = await this.findThemeById(id); // 재사용
    await this.themesRepository.remove(theme);
    return id;
  }

  private notFoundExceptionIfNotExists<T>(
    entity: T | null,
    errorMessage: string,
  ): void {
    if (!entity) {
      throw new NotFoundException(errorMessage);
    }
  }
}

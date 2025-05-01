import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateEvenimentDTO } from 'src/libs/dto/evenimente/eveniment.dto';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { EvenimenteService } from 'src/libs/repositories/evenimente/eveniment.service';
import { Roluri } from '../auth/decorators/roluri.decorator';
import { RolUtilizator } from 'src/libs/entities/utilizatori/utilizator.entity';

@Controller('evenimente')
export class EvenimenteController {
  constructor(private evenimenteService: EvenimenteService) {}

  @Get()
  findAll(): Promise<Eveniment[]> {
    return this.evenimenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Eveniment | null> {
    return this.evenimenteService.findOne(+id);
  }

  @Roluri(RolUtilizator.ADMIN)
  @Post()
  create(@Body() dto: CreateEvenimentDTO): Promise<Eveniment> {
    return this.evenimenteService.create(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.evenimenteService.remove(+id);
  }
}

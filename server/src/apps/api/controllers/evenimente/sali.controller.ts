import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSalaDTO } from 'src/libs/dto/sali/sala.dto';
import { SaliService } from 'src/libs/repositories/sali/sala.service';

@Controller('sali')
export class SaliController {
  constructor(private saliService: SaliService) {}
  @Post()
  async create(@Body() createSalaDTO: CreateSalaDTO) {
    return await this.saliService.create(createSalaDTO);
  }

  @Get()
  async findAll() {
    return await this.saliService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.saliService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateSalaDto: CreateSalaDTO) {
    return await this.saliService.update(id, updateSalaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.saliService.remove(id);
  }
}

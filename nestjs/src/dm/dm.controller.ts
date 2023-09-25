import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-conversation.dto';
import { UpdateDmDto } from './dto/update-dm.dto';

@Controller('conversations')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Post()
  create(@Body() createDmDto: CreateDmDto) {
    return this.dmService.create(createDmDto);
  }

  @Get()
  findAll() {
    return this.dmService.findAll();
  }

  @Get(':user1')
  findOne(@Param('id') id: string) {
    return this.dmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDmDto: UpdateDmDto) {
    return this.dmService.update(+id, updateDmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dmService.remove(+id);
  }
}

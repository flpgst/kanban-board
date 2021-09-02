import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() createListDto: CreateListDto, @User() user: UserEntity) {
    return this.listsService.create(createListDto, user);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.listsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.listsService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
    @User() user: UserEntity,
  ) {
    return this.listsService.update(+id, updateListDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.listsService.remove(+id, user);
  }
}

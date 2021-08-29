import { CreateBoardDto } from '../../boards/dto/create-board.dto';

export class CreateListDto {
  name: string;
  board: CreateBoardDto;
}

import { CreateBoardDto } from '../../boards/dto/create-board.dto';

export class CreateListDto {
  id?: number;
  name: string;
  board: CreateBoardDto;
}

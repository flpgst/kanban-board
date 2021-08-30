import { User } from '../../users/entities/user.entity';

export class CreateBoardDto {
  name: string;
  users: User[];
}

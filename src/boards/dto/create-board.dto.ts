import { User } from '../../users/entities/user.entity';

export class CreateBoardDto {
  id: number;
  name: string;
  users: User[];
}

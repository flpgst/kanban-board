import { List } from '../../lists/entities/list.entity';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  status: TaskStatus;
  title: string;
  description: string;
  scrumPonctuation: number;
  archived: boolean;
  list: List;
}

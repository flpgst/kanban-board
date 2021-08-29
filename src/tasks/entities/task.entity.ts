import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { List } from '../../lists/entities/list.entity';

export enum TaskStatus {
  TO_DO = 'todo',
  DOING = 'doing',
  DONE = 'done',
  BLOCKED = 'blocked',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'simple-enum',
    enum: TaskStatus,
  })
  status: TaskStatus;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  scrumPonctuation: number;

  @Column({
    default: false,
  })
  archived: boolean;

  @ManyToOne((type) => List)
  list: List;
}

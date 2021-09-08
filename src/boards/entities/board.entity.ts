import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  users: User[];

  constructor(board: Partial<Board>) {
    this.id = board?.id;
    this.name = board?.name;
    this.users = board?.users;
  }
}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((type) => Board)
  board: Board;

  constructor(name: string, board: Board) {
    this.name = name;
    this.board = board;
  }
}

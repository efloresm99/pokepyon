import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Hint {
  @PrimaryGeneratedColumn()
  hintId: number;

  @Column('varchar')
  hintName: string;

  @Column('smallint')
  hintOrder: number;

  @Column('varchar')
  hintValue: string;

  @ManyToOne(() => Question, (question) => question.hints)
  question: Question;
}

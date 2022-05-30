import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hint } from './hint.entity';
import { User } from './user.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column('smallint')
  currentHint: number;

  @Column('varchar')
  imageUrl: string;

  @Column('varchar')
  answer: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Hint, (hint) => hint.question)
  hints: Hint[];
}

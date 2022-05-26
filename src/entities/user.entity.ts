import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Purchase } from './purchase.entity';

@Entity()
@Unique('serverUser', ['serverId', 'discordUserId'])
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column('varchar')
  serverId: string;

  @Column('varchar')
  discordUserId: string;

  @Column('int')
  currentPoints: number;

  @Column('int')
  totalPoints: number;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];
}

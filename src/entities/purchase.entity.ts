import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './store.entity';
import { User } from './user.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  purchaseNumber: number;

  @Column('int')
  number: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @ManyToOne(() => Store, (store) => store.purchases)
  item: Store;
}

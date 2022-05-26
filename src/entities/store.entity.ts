import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './purchase.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  itemId: number;

  @Column('varchar')
  itemName: string;

  @Column('int')
  itemCost: number;

  @OneToMany(() => Purchase, (purchase) => purchase.item)
  purchases: Purchase[];
}

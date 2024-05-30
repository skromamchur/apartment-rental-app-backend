import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { MessagePhoto } from './Message-photo';
import { Apartment } from './Apartment';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.reviews, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'appartmentId' })
  apartment: Apartment;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  reviewer: User;

  @Column()
  rating: number;

  @Column({ default : false})
  checked: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
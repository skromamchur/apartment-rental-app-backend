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
import { Connection } from './Connection';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.sentMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  from: User;

  @ManyToOne(() => Connection, (connection) => connection.messages, {
    onDelete: 'CASCADE',
  })
  connection: Connection;

  @Column('text' , {array : true, nullable : true})
  photos : string[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
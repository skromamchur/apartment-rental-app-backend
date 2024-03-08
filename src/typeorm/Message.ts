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

  @OneToMany(() => MessagePhoto, (photo) => photo.message, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  photos: MessagePhoto[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
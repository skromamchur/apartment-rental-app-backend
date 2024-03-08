import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Message} from "./Message";

@Entity()
export class MessagePhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @ManyToOne(() => Message, message => message.photos, {
        onDelete: 'CASCADE'
    })
    message: Message;
}
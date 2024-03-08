import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {Apartment} from "./Apartment";
import {Message} from "./Message";
import {Review} from "./Review";
import {Connection} from "./Connection";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column({ nullable : true})
    avatar : string;

    @Column({ nullable : true})
    phone : string;

    @OneToMany(() => Apartment, apartment => apartment.user)
    apartments: Apartment[];

    @OneToMany(() => Message, message => message.from)
    sentMessages: Message[];

    @OneToMany(() => Review, review => review.reviewer, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable()
    reviews: Review[];

    @OneToMany(() => Connection, connection => connection.from, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable()
    connections: Connection[];

    @OneToMany(() => Connection, connection => connection.to, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable()
    receivedConnections: Connection[];

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
import {
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import {User} from "./User";
import {Message} from "./Message";

@Entity()
export class Connection {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.connections, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'fromUserId' })
    from: User;

    @ManyToOne(() => User, user => user.receivedConnections, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'toUserId' })
    to: User;

    @OneToMany(() => Message, message => message.connection, {
        onDelete: 'CASCADE'
    })
    messages : Message[]
}

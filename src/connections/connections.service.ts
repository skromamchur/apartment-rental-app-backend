import {Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Review} from "../typeorm/Review";
import {UsersService} from "../users/users.service";
import {Connection} from "../typeorm/Connection";
import {Message} from "../typeorm/Message";
import {MessagePhoto} from "../typeorm/Message-photo";
import * as process from "process";

@Injectable()
export class ConnectionsService {
  constructor(
      @InjectRepository(Connection)
      private readonly connectionRepository: Repository<Connection>,

      @InjectRepository(Message)
      private readonly messageRepository: Repository<Message>,

      private readonly userService: UsersService
  ) {}

  async createConnection(fromId: number, toId: number): Promise<void> {
    if(fromId === toId){
      return;
    }

    try {
      const connection = new Connection();

      connection.from = await this.userService.findOne(fromId);
      connection.to = await this.userService.findOne(toId);
      connection.messages = [];

      await this.connectionRepository.save(connection);
    } catch (error) {
      throw new Error('Помилка відправлення повідомлення: ' + error.message);
    }
  }

  async sendMessage(
      connectionId : number,
      userId: number,
      messageDto: { text: string },
      photos: string[],
  ): Promise<void> {
    try {
      const message = new Message();
      message.text = messageDto.text;
      message.from = await this.userService.findOne(userId);
      message.photos = photos;
      message.connection = await this.connectionRepository.findOne({ where : { id : connectionId}})

      // if (photos && photos.length > 0) {
      //   photos.forEach((photo) => {
      //     const messagePhoto = new MessagePhoto();
      //     messagePhoto.filename = `${process.env.API_URL}/uploads/${photo.filename}`;
      //     message.photos.push(messagePhoto);
      //   });
      // }

      await this.messageRepository.save(message);
    } catch (error) {
      throw new Error('Помилка відправлення повідомлення: ' + error.message);
    }
  }
}
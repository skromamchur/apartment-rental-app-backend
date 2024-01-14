import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentModule } from './apartment/apartment.module';

import entities from './typeorm';
import * as process from 'process';

import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import {GoogleMapsModule} from "./googlemaps/google-maps.module";
import {GoogleMapsService} from "./googlemaps/google-maps.service";
import {HttpModule, HttpService} from "@nestjs/axios";


@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal : true }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
              url: process.env.DATABASE_URL,
              type: 'postgres',
              entities,
              ssl: {
                  rejectUnauthorized: false,
              },
              synchronize: true,
          }),
          inject: [ConfigService],
      }),
      ApartmentModule,
      GoogleMapsModule,
      HttpModule,
      MulterModule.register({
          dest: './uploads',
      }),
      ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'uploads'),
          serveRoot: '/uploads'
      }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleMapsService],
})
export class AppModule {}

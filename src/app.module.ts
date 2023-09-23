import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentModule } from './apartment/apartment.module';

import entities from './typeorm';
import * as process from 'process';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

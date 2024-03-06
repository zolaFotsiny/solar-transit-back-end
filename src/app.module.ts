import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';





dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: (process.env.DB_TYPE as any) || 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,
        autoLoadEntities: true,
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

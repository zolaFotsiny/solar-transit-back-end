import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FileModule } from './file/file.module';





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
        synchronize: false,
        autoLoadEntities: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false, // You may set this to true in production after configuring certificates
          },
        },
      }
    ),
    DepartmentModule,
    EmployeeModule,
    AttendanceModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

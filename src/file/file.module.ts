import { Module } from '@nestjs/common';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { EmployeeModule } from 'src/employee/employee.module';
import { Employee } from 'src/employee/entities/employee.entity';
import { FileController } from './file.controller';
import { EmployeeService } from 'src/employee/employee.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from '../department/department.service';
import { DepartmentModule } from 'src/department/department.module';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Attendance, Department]),
    EmployeeModule,
    AttendanceModule,
    DepartmentModule

  ],
  controllers: [FileController],
  providers: [EmployeeService, AttendanceService, FileService, DepartmentService]
})
export class FileModule { }

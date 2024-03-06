import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AttendanceService } from 'src/attendance/attendance.service';
import { EmployeeService } from 'src/employee/employee.service';
import { FileService } from './file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Request } from 'express';

@Controller('file')
export class FileController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly attendanceService: AttendanceService,
    private readonly fileService: FileService,
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!file.originalname.match(/\.(xlsx)$/)) {
      throw new BadRequestException('Only Excel files are allowed!');
    }
    const excelData = await this.saveFile(file);
    return { message: 'File uploaded and data imported successfully!' };
  }

  private async saveFile(file) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Invalid file buffer');
    }

    const excelEmployeeData = await this.fileService.readFileEmployee(file);
    const excelAttendanceData = await this.fileService.readFileAttendance(file);

    await this.employeeService.bulkCreate(excelEmployeeData);
    await this.attendanceService.bulkCreate(excelAttendanceData);

    return { employeeData: excelEmployeeData, attendanceData: excelAttendanceData };
  }
}

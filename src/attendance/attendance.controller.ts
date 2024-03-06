import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    const attendance = await this.attendanceService.create(createAttendanceDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Attendance created successfully',
      data: attendance,
    };
  }

  @Get()
  async findAll() {
    const attendances = await this.attendanceService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Attendances retrieved successfully',
      data: attendances,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const attendance = await this.attendanceService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: 'Attendance retrieved successfully',
      data: attendance,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.attendanceService.update(id, updateAttendanceDto);
    return {
      status: HttpStatus.OK,
      message: 'Attendance updated successfully',
      data: attendance,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.attendanceService.remove(id);
    return {
      status: HttpStatus.OK,
      message: 'Attendance deleted successfully',
    };
  }
}

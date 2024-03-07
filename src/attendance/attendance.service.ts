import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class AttendanceService {


  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly employeeService: EmployeeService,
  ) { }




  // This action adds a new attendance
  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const employee = await this.employeeService.findByEmployeeIdentifier(createAttendanceDto.employee);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${createAttendanceDto.employee} not found`);
    }
    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      employee,
    });
    return this.attendanceRepository.save(attendance);
  }


  // This action returns all attendance
  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find();
  }

  // This action returns an attendance by id 
  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        id
      },
      relations: ["employee", "employee.department"]
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  // This action updates an attendance 
  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    const employee = await this.employeeService.findByEmployeeIdentifier(updateAttendanceDto.employee);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${updateAttendanceDto.employee} not found`);
    }
    this.attendanceRepository.merge(attendance, {
      ...updateAttendanceDto,
      employee,
    });
    return this.attendanceRepository.save(attendance);
  }


  // This action removes an attendance
  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.remove(attendance);
  }


  async bulkCreate(data: CreateAttendanceDto[]): Promise<Attendance[]> {
    try {
      const savedAttendances: Attendance[] = [];

      for (const item of data) {
        console.log(item);
        const employee = await this.employeeService.findByEmployeeIdentifier(item.employee);
        const existingAttendances = await this.attendanceRepository.find({
          where: { date: item.date, employee: { id: employee.id } },
        });
        if (existingAttendances.length === 0) {

          if (employee) {
            const attendanceData: Partial<Attendance> = {
              date: item.date,
              employee: employee,
            };

            const attendance = this.attendanceRepository.create(attendanceData);
            const savedAttendance = await this.attendanceRepository.save(attendance);
            savedAttendances.push(savedAttendance);
          } else {
            continue;
          }

        } else {
          console.log('Existing attendance record. Ignored:', existingAttendances);
        }
      }
      return savedAttendances;
    } catch (error) {
      throw error;
    }
  }

}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { EmployeeService } from 'src/employee/employee.service';
import * as moment from 'moment';

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
    return this.attendanceRepository.find({ relations: ["employee", "employee.department"] });
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


  async getYearlyAttendanceStatistics(): Promise<any> {
    const currentYear = new Date().getFullYear();
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();

    // Generate a list of all months in the current year
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize an array to hold the attendance count for each month
    let monthlyCounts: number[] = new Array(12).fill(0);

    // Query attendance records and fill in the counts
    const result = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('MONTH(attendance.date) AS month')
      .addSelect('COUNT(attendance.id)', 'count')
      .where('attendance.date >= :startOfYear', { startOfYear })
      .andWhere('attendance.date <= :endOfYear', { endOfYear })
      .groupBy('month')
      .getRawMany();

    // Fill in the attendance count for each month
    result.forEach(item => {
      const monthIndex = item.month - 1; // Convert month number to array index (0-based)
      monthlyCounts[monthIndex] = item.count;
    });

    // Ensure all values are numbers
    monthlyCounts = monthlyCounts.map(value => Number(value));

    return {
      categories: monthNames,
      value: monthlyCounts,
    };
  }
}

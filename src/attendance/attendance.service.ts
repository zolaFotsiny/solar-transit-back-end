import { Injectable } from '@nestjs/common';
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


  create(createAttendanceDto: CreateAttendanceDto) {
    return 'This action adds a new attendance';
  }

  findAll() {
    return `This action returns all attendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }

  async bulkCreate(data: CreateAttendanceDto[]): Promise<Attendance[]> {
    try {
      const savedAttendances: Attendance[] = [];

      for (const item of data) {
        console.log(item);
        const employee = await this.employeeService.employeeIdentifier(item.employee);
        const existingAttendances = await this.attendanceRepository.find({
          where: { date: item.date, employee: { id: employee.id } },
        });
        if (existingAttendances.length === 0) {

          if (employee) {
            const attendanceData: Partial<Attendance> = {
              date: item.date,
              employee: employee, // Compare with employee.id
              // Ajouter d'autres champs communs ici
            };

            const attendance = this.attendanceRepository.create(attendanceData);

            console.log('Enregistrement d\'attendance créé :', attendance);

            const savedAttendance = await this.attendanceRepository.save(attendance);
            savedAttendances.push(savedAttendance);
          } else {
            console.error(`Employé avec l'ID ${item.employee} non trouvé`);
            continue;
          }

        } else {
          console.log('Enregistrement d\' attendance déjà existant. Ignoré :', existingAttendances);
        }
      }

      console.log('Enregistrements d\'attendance enregistrés :', savedAttendances);
      return savedAttendances;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des enregistrements d\'attendance :', error);
      throw error;
    }
  }

}

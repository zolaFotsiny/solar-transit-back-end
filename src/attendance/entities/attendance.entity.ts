import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity({ name: 'Attendance' })
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @ManyToOne(() => Employee, employee => employee.attendances, { eager: true })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;


}

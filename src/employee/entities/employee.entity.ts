import { Attendance } from "src/attendance/entities/attendance.entity";
import { Department } from "src/department/entities/department.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Employee' })
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    departmentId: number;

    @Column()
    employeeIdentifier: string;

    // Many employees belong to one department
    @ManyToOne(() => Department, department => department.employees, { cascade: true })
    department: Department;

    // One employee has many attendances
    @OneToMany(() => Attendance, attendance => attendance.employee)
    attendances: Attendance[]
}
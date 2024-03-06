import { Department } from "src/department/entities/department.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}

import { IsNotEmpty } from 'class-validator';

export class CreateEmployeeDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    departmentId: number;

    @IsNotEmpty()
    employeeIdentifier: string;
}

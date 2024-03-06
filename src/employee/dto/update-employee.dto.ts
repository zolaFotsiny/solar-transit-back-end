import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    firstName?: string;
    lastName?: string;
    departmentId?: number;
    employeeIdentifier?: string;
}

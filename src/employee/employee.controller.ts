import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeeService.create(createEmployeeDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Employee created successfully',
      data: employee,
    };
  }

  @Get()
  async findAll() {
    const employees = await this.employeeService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Employees retrieved successfully',
      data: employees,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const employee = await this.employeeService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: 'Employee retrieved successfully',
      data: employee,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeService.update(id, updateEmployeeDto);
    return {
      status: HttpStatus.OK,
      message: 'Employee updated successfully',
      data: employee,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.employeeService.delete(id);
    return {
      status: HttpStatus.OK,
      message: 'Employee deleted successfully',
    };
  }
}

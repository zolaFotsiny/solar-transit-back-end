import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  // Create a new Employee entity and save it to the database
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  // Retrieve all Employee entities from the database
  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: ['department'] });
  }


  // Retrieve a single Employee entity by its ID
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: {
        id
      },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }


  async findByEmployeeIdentifier(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: {
        employeeIdentifier: id
      },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  // Update an existing Employee entity with new data
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.findOne(id);
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    Object.assign(existingEmployee, updateEmployeeDto);
    return this.employeeRepository.save(existingEmployee);
  }

  // Delete an Employee entity by its ID
  async delete(id: number): Promise<void> {
    const employee = await this.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.employeeRepository.remove(employee);
  }



  // This method takes an array of employee data, creates new employees or updates existing ones, and saves them to the database.
  async bulkCreate(data: CreateEmployeeDto[]): Promise<Employee[]> {
    try {
      const employees = data.map(async (employeeData) => {
        // Find existing employee
        let employee = await this.employeeRepository.findOne({
          where: { employeeIdentifier: employeeData.employeeIdentifier }
        });

        // If employee doesn't exist, create a new one
        if (!employee) {
          employee = this.employeeRepository.create(employeeData);
        } else {
          // If employee exists, update it
          employee = this.employeeRepository.merge(employee, employeeData);
        }

        return this.employeeRepository.save(employee);
      });

      return Promise.all(employees);
    } catch (error) {
      console.error('Error saving employees:', error);
      throw error;
    }
  }

}

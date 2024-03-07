import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CriteriaDepartmentDto } from './dto/criteria-department.dto';

@Injectable()
export class DepartmentService {

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }


  async createWithContrainte(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existingDepartment = await this.departmentRepository.findOne({ where: { name: createDepartmentDto.name } });

    if (existingDepartment) {
      throw new ConflictException('A department with this name already exists.');
    }

    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  // This action adds a new department
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }


  // This action returns all department
  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }



  async findByCriteria(criteria: Partial<CriteriaDepartmentDto>): Promise<Department[]> {
    const { id, name } = criteria;

    const whereClause: any = {};

    if (id) {
      whereClause.id = id;
    }

    if (name) {
      whereClause.name = Like(`%${name}%`);
    }

    const departments = await this.departmentRepository.find({
      where: whereClause,
    });

    if (!departments || departments.length === 0) {
      throw new NotFoundException(`No departments found with the given criteria`);
    }

    return departments;
  }


  // This action returns a  department by id 
  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: {
        id
      },
      relations: ['employees'],
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  // This action updates a department 
  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const existingDepartment = await this.findOne(id);
    if (!existingDepartment) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    Object.assign(existingDepartment, updateDepartmentDto);
    return this.departmentRepository.save(existingDepartment);
  }


  // `This action removes a  department
  async delete(id: number): Promise<void> {
    const department = await this.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    await this.departmentRepository.remove(department);
  }


  async findByName(name: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: {
        name
      },
    });
    return department;
  }


}

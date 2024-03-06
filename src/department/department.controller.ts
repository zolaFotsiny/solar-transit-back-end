import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentService.create(createDepartmentDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Department created successfully',
      data: department,
    };
  }

  @Get()
  async findAll() {
    const departments = await this.departmentService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Departments retrieved successfully',
      data: departments,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const department = await this.departmentService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: 'Department retrieved successfully',
      data: department,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentService.update(id, updateDepartmentDto);
    return {
      status: HttpStatus.OK,
      message: 'Department updated successfully',
      data: department,
    };
  }


  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.departmentService.delete(id);
    return {
      status: HttpStatus.OK,
      message: 'Department deleted successfully',
    };
  }
}

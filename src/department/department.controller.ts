import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CriteriaDepartmentDto } from './dto/criteria-department.dto';
import { Department } from './entities/department.entity';

interface ApiResponse {
  status: HttpStatus;
  message: string;
  data?: any;
  error?: string;
}

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
  async findAll(@Body() criteria: Partial<CriteriaDepartmentDto>, @Query() query: any): Promise<ApiResponse> {
    try {
      let departments: Department[];
      if (Object.keys(criteria).length > 0 || Object.keys(query).length > 0) {
        departments = await this.departmentService.findByCriteria(criteria);
      } else {
        departments = await this.departmentService.findAll();
      }
      if (departments.length > 0) {
        return {
          status: HttpStatus.OK,
          message: 'Departments retrieved successfully',
          data: departments,
        };
      } else {
        return {
          status: HttpStatus.NO_CONTENT,
          message: 'No departments found',
          data: [],
        };
      }
    } catch (error) {
      console.error('Error retrieving departments:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve departments',
        error: error.message,
      };
    }
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

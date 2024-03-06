import { Injectable, BadRequestException } from '@nestjs/common';
import * as Excel from 'exceljs';
import { DepartmentService } from '../department/department.service';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class FileService {

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
  ) { }

  private async readExcelData(buffer: Buffer, sheetName: string, columnMappings: Record<string, string>[]) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      throw new BadRequestException(`Sheet "${sheetName}" not found in the Excel workbook.`);
    }

    const data = [];
    const columnIndexMap = {};

    sheet.getRow(1).eachCell((cell, colNumber) => {
      const title = cell.value.toString().trim();
      if (columnMappings.some(mapping => mapping.excelColumnName === title)) {
        columnIndexMap[title] = colNumber;
      }
    });

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        const rowData = {};
        columnMappings.forEach(mapping => {
          const excelColumnName = mapping.excelColumnName;
          const attribute = mapping.attribute;
          Reflect.set(rowData, attribute, row.getCell(columnIndexMap[excelColumnName]).value);
        });
        data.push(rowData);
      }
    });

    return data;
  }

  async readFileEmployee(file: any) {
    const employeeMappings = [
      { excelColumnName: 'Firstname', attribute: 'firstName' },
      { excelColumnName: 'Lastname', attribute: 'lastName' },
      { excelColumnName: 'Department', attribute: 'departmentId' },
      { excelColumnName: 'ID', attribute: 'employeeIdentifier' },
    ];

    const employees = await this.readExcelData(file.buffer, 'Employee', employeeMappings);

    for (const employee of employees) {
      const departmentName = employee['departmentId'];
      let department = await this.departmentService.findByName(departmentName);
      if (!department) {
        department = await this.departmentService.create({ name: departmentName });
      }
      employee.departmentId = department.id;
    }

    return this.employeeService.bulkCreate(employees);
  }

  async readFileAttendance(file: any) {
    const attendanceMappings = [
      { excelColumnName: 'EmployeeId', attribute: 'employee' },
      { excelColumnName: 'Date', attribute: 'date' },
    ];

    return this.readExcelData(file.buffer, 'Attendance', attendanceMappings);
  }
}

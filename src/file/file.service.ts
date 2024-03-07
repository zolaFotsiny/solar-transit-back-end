import { Injectable, BadRequestException } from '@nestjs/common';
import * as Excel from 'exceljs';
import { DepartmentService } from '../department/department.service';
import { EmployeeService } from 'src/employee/employee.service';

// Define the FileService class
@Injectable()
export class FileService {

  // Inject the DepartmentService and EmployeeService in the constructor
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
  ) { }

  // Method to read data from an Excel file
  private async readExcelData(buffer: Buffer, sheetName: string, columnMappings: Record<string, string>[]) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      throw new BadRequestException(`Sheet "${sheetName}" not found in the Excel workbook.`);
    }

    const data = [];
    const columnIndexMap = {};

    // Map the column index based on the column mappings
    sheet.getRow(1).eachCell((cell, colNumber) => {
      const title = cell.value.toString().trim();
      if (columnMappings.some(mapping => mapping.excelColumnName === title)) {
        columnIndexMap[title] = colNumber;
      }
    });

    // Read the data from each row based on the column mappings
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

  // Method to read employee data from an Excel file
  async readFileEmployee(file: any) {
    const employeeMappings = [
      { excelColumnName: 'Firstname', attribute: 'firstName' },
      { excelColumnName: 'Lastname', attribute: 'lastName' },
      { excelColumnName: 'Department', attribute: 'departmentId' },
      { excelColumnName: 'ID', attribute: 'employeeIdentifier' },
    ];

    const employees = await this.readExcelData(file.buffer, 'Employee', employeeMappings);

    // Create the department if it does not exist and assign the department ID to the employee
    for (const employee of employees) {
      const departmentName = employee['departmentId'];
      let department = await this.departmentService.findByName(departmentName);
      if (!department) {
        department = await this.departmentService.create({ name: departmentName });
      }
      employee.departmentId = department.id;
    }

    // Bulk create the employees
    return this.employeeService.bulkCreate(employees);
  }

  // Method to read attendance data from an Excel file
  async readFileAttendance(file: any) {
    const attendanceMappings = [
      { excelColumnName: 'EmployeeId', attribute: 'employee' },
      { excelColumnName: 'Date', attribute: 'date' },
    ];

    // Read the attendance data from the Excel file
    return this.readExcelData(file.buffer, 'Attendance', attendanceMappings);
  }
}

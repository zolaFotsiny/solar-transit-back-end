    // Many employees belong to one department
    @ManyToOne(() => Department, department => department.employees, { cascade: true })
    department: Department;

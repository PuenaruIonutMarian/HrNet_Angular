import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../employee.service';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'employee-table',
  standalone: true,
  imports: [NgFor],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css'
})
export class EmployeeTableComponent {

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
      console.log(data);
    })
  }

  deleteEmployee(id: number) : void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (response) => {
        this.employees = this.employees.filter(employee => employee.id !== id);
      },
      error: (error) => {
        console.log('Error occured: ', error);
      }
    }
    )
  }

  editEmployee(id:number) : void {
    this.router.navigate(['/edit', id]);
  }

}

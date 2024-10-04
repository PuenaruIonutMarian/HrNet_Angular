import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {

  employee:Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: ''
  }

  isEditing: boolean = false;

  errorMessage: string = '';

  // The constructor is a special method in a class that is called when an instance of the class is created.
  // In this case, we are injecting three services into the EmployeeFormComponent: EmployeeService, Router, and ActivatedRoute.
  // The EmployeeService is a service that provides methods for creating, editing, and deleting employees from the database.
  // The Router is a service that provides methods for navigating between routes in the application.
  // The ActivatedRoute is a service that provides information about the currently active route, such as the parameters that were passed in the URL.
  constructor(
    // The EmployeeService is injected into the component and is used to interact with the database.
    private employeeService: EmployeeService, 

    // The Router is injected into the component and is used to navigate between routes in the application.
    private router: Router,

    // The ActivatedRoute is injected into the component and is used to get information about the currently active route.
    private route: ActivatedRoute  
  ) { }
    

  // This lifecycle hook is called after the component is initialized.
  // It is used to subscribe to the route's parameter map and get the 'id' parameter.
  // If the 'id' parameter is present, it means we are in 'edit' mode
  ngOnInit(): void {
    // Subscribe to the route's parameter map to get the 'id' parameter
    this.route.paramMap.subscribe((result) => {
      // Get the 'id' parameter from the route's parameter map
      const id = result.get('id');

      if(id){
        // We are in 'edit' mode
        this.isEditing = true;

        // Call the EmployeeService to get the employee by id
        // The EmployeeService will go to the database and retrieve the employee by the given id
        // If the operation is successful, the employee will be assigned to the component's 'employee' property
        // If there is an error, the error message will be assigned to the component's 'errorMessage' property
        this.employeeService.getEmployeeById(Number(id)).subscribe({
          next: (result) => {
            // On success, assign the retrieved employee to the component's 'employee' property
            this.employee = result;
          },
          error: (err) => {
            // On error, assign the error message to the component's 'errorMessage' property
            this.errorMessage = `Error occured (${err.status})`;
          }
        })
      }
    });
  }


  onSubmit() : void {
    // Check if we are in "edit" mode
    if(this.isEditing){
      // Call the EmployeeService to edit the employee
      this.employeeService.editEmployee(this.employee)
      .subscribe({
        next: () => {
          // on success, navigate to the root route
          this.router.navigate(['/']);
        },
        error: (err) => {
          // on error, log the error and set an error message
          console.error(err);
          this.errorMessage = `Error occured during updating (${err.status})`;
        }
      });
    } else {
      // if we are not in edit mode, we are creating a new employee
      // Call the EmployeeService to create the employee
      this.employeeService.createEmployee(this.employee)
      .subscribe({
        next: () => {
          // on success, navigate to the root route
          this.router.navigate(['/']);
        },
        error: (err) => {
          // on error, log the error and set an error message
          console.error(err);
          this.errorMessage = `Error occured during creating (${err.status})`;
        }
      });
    }    
  }
}

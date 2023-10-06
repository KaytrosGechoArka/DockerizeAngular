import { Component, OnInit } from '@angular/core';
import { Employee } from './employee'
import { HttpErrorResponse } from '@angular/common/http'
import { EmployeeService } from './employee.service'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public employees!: Employee[];
  public editEmployee?: Employee | null;
  public deleteEmployee?: Employee | null;

  constructor(private employeeService:EmployeeService){}
  
  ngOnInit(){
    this.getEmployees();
  }

  public getEmployees():void{
    this.employeeService?.getEmployees().subscribe(
      (response: Employee[])=>{
        this.employees=response;
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm:NgForm){
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployees(addForm.value).subscribe(
      (response:Employee)=>{
        console.log(response);
        this.getEmployees();
        addForm.reset()
      },
      (error:HttpErrorResponse)=>{
        alert(error.message)
      }
    );
  }

  public onUpdateEmployee(employee: Employee) {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.updateEmployees(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }
  public onDeleteEmployee(employeeId: number) :void{
    document.getElementById('add-employee-form')?.click();
    this.employeeService.deleteEmployees(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee  | null=null, mode: string ): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
       button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee  ;
       button.setAttribute('data-target', '#updateEmployeeModal');
     }
     if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }
}

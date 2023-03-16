import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoListComponent } from 'src/app/components/to-do-list/to-do-list.component';
import { RouterModule, Routes } from '@angular/router';
import { AntdModule } from '../antd/antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportancePipe } from '../../pipes/importance.pipe';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'todolist',
    pathMatch: 'full'
  },
  {
    path: 'todolist',
    component: ToDoListComponent
  },
  {
    path: 'mylist',
    component: ToDoListComponent
  },
  {
    path: 'otherslist',
    component: ToDoListComponent
  },
];

@NgModule({
  declarations:[
    ToDoListComponent,
    ImportancePipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule]
})
export class LazyModule { 

}

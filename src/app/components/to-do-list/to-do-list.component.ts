import { Component, OnInit } from '@angular/core';
import { TodolistService } from 'src/app/services/todolist.service';
import type { Item } from '../../services/todolist.service'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})

export class ToDoListComponent implements OnInit {
  list: Array<Item> = []
  validateForm!: UntypedFormGroup;
  editItem!: UntypedFormGroup
  isVisible = false;
  currentItem: Item = {
    title: '',
    founder: '',
    time: '',
    finished: false,
    importance: 0,
    id: 0
  }
  moment = moment
  constructor(
    public service: TodolistService,
    private fb: UntypedFormBuilder,
    private message: NzMessageService,
    public router: Router,
    public route: ActivatedRoute,
    private modal: NzModalService
  ) { }

  getList(list: Array<Item>) {
    switch (this.router.url) {
      case '/mylist':
        this.list = list.filter(item => item.founder == localStorage.getItem('username'))
        break;
      case '/otherslist':
        this.list = list.filter(item => item.founder !== localStorage.getItem('username'))
        break;
      default:
        this.list = list
        break;
    }
  }
  ngOnInit() {
    this.getList(this.service.list)
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      importance: [null, [Validators.required]],
      time: [null,[Validators.required]],
    });
    this.editItem = this.fb.group({
      title: [null, [Validators.required]],
      importance: [null, [Validators.required]],
      finished: [null, [Validators.required]],
      founder: [null, [Validators.required]],
      time: [null, [Validators.required]],
    });
    this.service.subject.subscribe({
      next: (x) => {
        this.service.sort = this.service.sort
        this.getList(x)
      }
    })
  }

  editIsVisible = false;
  edit(id: number): any {
    if (!localStorage.getItem('username')) {
      return this.message.create('warning', `请登录`);
    }
    this.editIsVisible = true;
    this.currentItem = this.list.find(item => item.id == id) as Item
  }
  editCancel() {
    this.editIsVisible = false;
  }
  editOk(): any {
    this.editIsVisible = false;
    let targetItem: Item = this.list.find(item => item.id == this.currentItem.id) as Item
    if (targetItem.founder !== localStorage.getItem('username')) {
      return this.message.create('warning', `无法改变他人待办项`);
    }
    targetItem.finished = this.editItem.value.finished
    targetItem.time = this.editItem.value.time
    targetItem.title = this.editItem.value.title
    targetItem.importance = this.editItem.value.importance
    this.service.subject.next(this.service.list)
  }

  showModal() {
    if (!localStorage.getItem('username')) {
      return this.message.create('warning', `请登录`);
    }
    return this.isVisible = true;
  }

  handleOk(): any {
    const item: Item = {
      ...this.validateForm.value,
      finished: false,
      founder: localStorage.getItem('username'),
      id: this.service.list.length + 1
    }
    this.service.list.push(item)
    this.isVisible = false;
    this.service.subject.next(this.service.list)
    this.message.create('success', `创建成功！`);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(e: any, data: Item): any {
    e.stopPropagation()
    if (!localStorage.getItem('username')) {
      return this.message.create('warning', `请登录`);
    }
    if (data.founder !== localStorage.getItem('username')) {
      return this.message.create('warning', `无法删除他人待办项`);
    }
    this.modal.confirm({
      nzTitle: '是否确定删除该待办项?',
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: (): any => {
        this.service.list = this.service.list.filter(item => item.id !== data.id)
        this.service.subject.next(this.service.list)
      },
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  sort() {
    this.service.subject.next(this.service.list)
  }
}

import { Component, OnInit } from '@angular/core';
import { TodolistService } from 'src/app/services/todolist.service';
import type { Item } from '../../services/todolist.service'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})

export class ToDoListComponent implements OnInit {
  moment = moment
  editIsVisible = false;
  subscription!: Subscription;
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
      time: [null, [Validators.required]],
    });
    this.editItem = this.fb.group({
      title: [null, [Validators.required]],
      importance: [null, [Validators.required]],
      finished: [null, [Validators.required]],
      founder: [null, [Validators.required]],
      time: [null, [Validators.required]],
    });
    this.subscription = this.service.subject.subscribe({
      next: (x) => {
        this.service.sort = this.service.sort
        this.getList(x)
      }
    })
  }
  // 判断是否登录
  isLogin() {
    if (!localStorage.getItem('username')) {
      this.message.create('warning', `请登录`);
      throw '没登录'
    }
  }
  // 打开编辑
  edit(id: number) {
    this.isLogin()
    this.editIsVisible = true;
    this.currentItem = { ...this.list.find(item => item.id == id) } as Item
  }
  // 编辑取消
  editCancel() {
    this.editIsVisible = false;
  }
  // 编辑确定
  editOk(): any {
    if (!this.editItem.valid) {
      return Object.values(this.editItem.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    let targetItem: any = this.list.find(item => item.id == this.currentItem.id) as Item
    if (targetItem.founder !== localStorage.getItem('username')) {
      return this.message.create('warning', `无法改变他人待办项`);
    }
    this.editIsVisible = false;
    for (let key in targetItem) {
      if (key == 'id') return
      targetItem[key] = this.editItem.value[key]
    }
    this.service.subject.next(this.service.list)
  }
  // 打开创建待办事项
  showModal() {
    this.isLogin()
    return this.isVisible = true;
  }
  // 确定创建待办项
  handleOk(): any {
    if (!this.validateForm.valid) {
      return Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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
  // 取消创建待办项
  handleCancel(): void {
    this.isVisible = false;
  }
  // 确认删除
  showDeleteConfirm(e: any, data: Item): any {
    e.stopPropagation()
    this.isLogin()
    if (data.founder !== localStorage.getItem('username')) {
      return this.message.create('warning', `无法删除他人待办项`);
    }
    this.modal.confirm({
      nzTitle: '是否确定删除该待办项?',
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: (): any => {
        let index = (this.service.list.findIndex(item => item.id == data.id))
        this.service.list.splice(index, index + 1)
        this.service.subject.next(this.service.list)
      },
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  // 分类排序
  sort() {
    this.service.subject.next(this.service.list)
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}

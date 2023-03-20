import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TodolistService } from '../services/todolist.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private message: NzMessageService,
    public service: TodolistService
  ) { }
  isVisible = false;
  username: any
  inputVal: any
  ngOnInit() {
    // 登录验证
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')
      this.message.create('success', `登陆成功！`);
      this.service.subject.next(this.service.list)
    }
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    // 登录
    this.username = this.inputVal
    localStorage.setItem('username', this.username)
    this.isVisible = false;
    this.message.create('success', `登陆成功！`);
    this.service.subject.next(this.service.list)
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  logout() {
    // 注销
    this.username = undefined
    localStorage.removeItem('username')
    this.message.create('warning', `您已注销`);
    this.service.subject.next(this.service.list)
  }
}

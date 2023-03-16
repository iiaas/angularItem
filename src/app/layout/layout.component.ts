import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private message: NzMessageService
  ) { }
  isVisible = false;
  username: any
  inputVal: any
  ngOnInit() {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')
      this.message.create('success', `登陆成功！`);
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.username = this.inputVal
    localStorage.setItem('username', this.username)
    this.isVisible = false;
    this.message.create('success', `登陆成功！`);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  logout() {
    this.username = undefined
    localStorage.removeItem('username')
    this.message.create('warning', `您已注销`);
  }
}

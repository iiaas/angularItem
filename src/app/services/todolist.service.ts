import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Item {
  title: string,
  founder: string,
  time: string,
  finished: boolean,
  importance: number,
  id: number
}

@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  subject = new Subject<any>();
  list: Array<Item> = [
    {
      title: 'sing',
      founder: '蔡徐坤',
      time: '2021-08-11',
      finished: true,
      importance: 0,
      id: 1
    },
    {
      title: 'dance',
      founder: '蔡徐坤',
      time: '2021-08-11',
      finished: true,
      importance: 0,
      id: 2
    },
    {
      title: 'rap',
      founder: 'cxk',
      time: '2021-08-12',
      finished: true,
      importance: 1,
      id: 3
    },
    {
      title: 'basketball',
      founder: 'cxk',
      time: '2021-08-12',
      finished: true,
      importance: 2,
      id: 4
    },
  ]
  _sort = 'imprtanceUp'
  get sort() {
    return this._sort
  }
  set sort(val) {
    switch (val) {
      case 'imprtanceUp':
        this.list = this.list.sort((a, b) => (a.importance - b.importance))
        break;
      case 'imprtanceDown':
        this.list = this.list.sort((a, b) => (b.importance) - a.importance)
        break;
    }
    this._sort = val
  }
  constructor() {
    // dev
    this.list = this.list.sort((a, b) => (a.importance - b.importance))
  }
}

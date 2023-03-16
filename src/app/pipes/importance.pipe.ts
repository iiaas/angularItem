import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'importance'
})
export class ImportancePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    let arr = ['低','中','高']
    return arr[value];
  }

}

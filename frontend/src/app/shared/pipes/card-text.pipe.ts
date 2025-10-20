import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardText'
})
export class CardTextPipe implements PipeTransform {

  transform(value: string): unknown {
    if (value.length > 252) {
      return (value.slice(0, 252) + '...');
    }
    return value;
  }

}

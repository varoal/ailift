import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatTimeService {
  public format(time: number): string {
    time = Math.floor(time);
    if (time < 60) {
      if (time < 1) {
        return '1min';
      }
      return time + 'min';
    } else {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      if (minutes === 0) {
        return hours + 'h';
      } else {
        return hours + 'h ' + minutes + 'min';
      }
    }
  }
}

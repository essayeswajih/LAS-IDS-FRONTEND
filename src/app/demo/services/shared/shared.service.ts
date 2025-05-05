import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class SharedService {
  private dataSource = new BehaviorSubject<number>(0);
  currentData = this.dataSource.asObservable();

  updateData() {
    this.dataSource.next(this.dataSource.value + 1);
  }
}
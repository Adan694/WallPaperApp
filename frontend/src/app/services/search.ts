import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Search {
  private searchKeyword = new BehaviorSubject<string>('');
  currentKeyword = this.searchKeyword.asObservable();

  updateKeyword(keyword: string) {
    this.searchKeyword.next(keyword);
  }
}

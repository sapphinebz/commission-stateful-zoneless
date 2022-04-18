import { Component, OnInit } from '@angular/core';
import { CommissionService } from './services/commission/commission.service';
import { OnDestroyService } from './services/destroy/on-destroy.service';
import { RxOperatorService } from './services/rx-operator/rx-operator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [OnDestroyService, RxOperatorService, CommissionService],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  /**
   * ทดสอบ changeDetection ที่เกิดขึ้น
   */
  get detect() {
    console.count('detect');
    return '';
  }
}

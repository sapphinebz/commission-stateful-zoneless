import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs';
import {
  CommissionService,
  COMMISSION_TYPE,
} from '../services/commission/commission.service';
import { OnDestroyService } from '../services/destroy/on-destroy.service';
import { RxOperatorService } from '../services/rx-operator/rx-operator.service';

@Component({
  selector: 'app-commission-type',
  templateUrl: './commission-type.component.html',
  styleUrls: ['./commission-type.component.scss'],
  providers: [OnDestroyService, RxOperatorService],
})
export class CommissionTypeComponent implements OnInit {
  commissionTypeForm = new FormControl(COMMISSION_TYPE.NORMAL);
  NORMAL_COMMISSION_TYPE = COMMISSION_TYPE.NORMAL;
  RECYCLE_COMMISSION_TYPE = COMMISSION_TYPE.RECYCLE;

  commissionTypeEffect = this.commissionTypeForm.valueChanges.pipe(
    startWith(this.commissionTypeForm.value),
    this.rx.effect((value) => {
      this.commissionService.changeCommissionType(value);
    })
  );

  constructor(
    private rx: RxOperatorService,
    private commissionService: CommissionService
  ) {}

  ngOnInit(): void {}
}

import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, ReplaySubject } from 'rxjs';
import { RxOperatorService } from '../rx-operator/rx-operator.service';

export const MAX_COMMISSION_VALUE = 3;
export const MIN_COMMISSION_VALUE = 0;
export const enum LANG {
  EN = 'EN',
  FR = 'FR',
  NL = 'NL',
}

export const enum COMMISSION_TYPE {
  NORMAL = 'Normal',
  RECYCLE = 'Recycle',
}

@Injectable()
export class CommissionService {
  _commissionValue = new ReplaySubject<number>(1);
  _commissionType = new ReplaySubject<string>(1);

  commissionType$ = this._commissionType.pipe(this.rx.stateful());
  commissionValue$ = this._commissionValue.pipe(this.rx.stateful());

  initialCommissionValueOfComissionType$ = this.commissionType$.pipe(
    map((commissionType) => {
      switch (commissionType) {
        case COMMISSION_TYPE.NORMAL:
          return MIN_COMMISSION_VALUE;
        case COMMISSION_TYPE.RECYCLE:
          return MAX_COMMISSION_VALUE;
        default:
          return MIN_COMMISSION_VALUE;
      }
    }),
    this.rx.stateful()
  );

  constructor(public rx: RxOperatorService) {}

  changeCommissionType(type: string) {
    this._commissionType.next(type);
  }

  changeCommissionValue(value: number) {
    this._commissionValue.next(value);
  }
}

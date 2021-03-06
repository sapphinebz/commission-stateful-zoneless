import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  combineLatest,
  combineLatestWith,
  filter,
  fromEvent,
  map,
  mapTo,
  merge,
  Observable,
  pipe,
  startWith,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  CommissionService,
  MAX_COMMISSION_VALUE,
  MIN_COMMISSION_VALUE,
} from '../services/commission/commission.service';
import { OnDestroyService } from '../services/destroy/on-destroy.service';
import { RxOperatorService } from '../services/rx-operator/rx-operator.service';

const enum INPUT_BLUR_STATUS {
  NO_VALUE,
  EXCEED_MAXIMUM,
  BELOW_MINIMUM,
  IDLE,
}

@Component({
  selector: 'app-commission-value',
  templateUrl: './commission-value.component.html',
  styleUrls: ['./commission-value.component.scss'],
  providers: [OnDestroyService, RxOperatorService],
})
export class CommissionValueComponent implements OnInit {
  @ViewChild('commissionSlider', { read: ElementRef }) set commissionSliderEl(
    el: ElementRef<HTMLInputElement>
  ) {
    this.onViewComissionSliderEl.next(el);
  }

  @ViewChild('commissionInput', { read: ElementRef }) set commissionInputEl(
    el: ElementRef<HTMLInputElement>
  ) {
    this.onViewCommissionInputEl.next(el);
  }

  onViewCommissionInputEl = new Subject<ElementRef<HTMLInputElement>>();
  onViewComissionSliderEl = new Subject<ElementRef<HTMLInputElement>>();

  onInputBlurStatus$ = this.onViewCommissionInputEl.pipe(
    switchMap((ref) =>
      fromEvent(ref.nativeElement, 'blur').pipe(
        map(() => {
          const value = ref.nativeElement.value;
          if (value === '' || value === undefined || !isFinite(Number(value))) {
            return INPUT_BLUR_STATUS.NO_VALUE;
          } else if (Number(value) > MAX_COMMISSION_VALUE) {
            return INPUT_BLUR_STATUS.EXCEED_MAXIMUM;
          } else if (Number(value) < MIN_COMMISSION_VALUE) {
            return INPUT_BLUR_STATUS.BELOW_MINIMUM;
          }
          return INPUT_BLUR_STATUS.IDLE;
        })
      )
    ),
    this.rx.actionful()
  );

  commissionSliderValue$ = this.onViewComissionSliderEl.pipe(
    this.switchToInputValue(),
    this.rx.stateful()
  );

  commissionInputValue$ = this.onViewCommissionInputEl.pipe(
    this.switchToInputValue(),
    this.rx.stateful()
  );

  commissionValue$ = merge(
    this.commissionInputValue$,
    this.commissionSliderValue$
  ).pipe(this.rx.stateful());

  onInputValueOnBlurNoValue$ = this.onInputBlurStatus$.pipe(
    filter((status) => status === INPUT_BLUR_STATUS.NO_VALUE),
    withLatestFrom(this.commissionSliderValue$, (_, value) => value)
  );

  onInputValueOnBlurExceedMaxValue$ = this.onInputBlurStatus$.pipe(
    filter((status) => status === INPUT_BLUR_STATUS.EXCEED_MAXIMUM),
    mapTo(MAX_COMMISSION_VALUE)
  );

  onInputValueOnBlurBelowMinValue$ = this.onInputBlurStatus$.pipe(
    filter((status) => status === INPUT_BLUR_STATUS.BELOW_MINIMUM),
    mapTo(MIN_COMMISSION_VALUE)
  );

  changesInputValue$ = merge(
    this.commissionSliderValue$,
    this.comissionService.initialCommissionValueOfComissionType$,
    this.onInputValueOnBlurNoValue$,
    this.onInputValueOnBlurExceedMaxValue$,
    this.onInputValueOnBlurBelowMinValue$
  );

  changesSliderValue$ = merge(
    this.commissionInputValue$,
    this.comissionService.initialCommissionValueOfComissionType$
  );

  changeCommissionInputValueEffect = this.changesInputValue$.pipe(
    combineLatestWith(this.onViewCommissionInputEl),
    this.rx.effect(([sliderValue, inputRef]) => {
      inputRef.nativeElement.value = `${sliderValue}`;
    })
  );

  changeCommissionSliderValueEffect = this.changesSliderValue$.pipe(
    combineLatestWith(this.onViewComissionSliderEl),
    this.rx.effect(([changedValue, sliderRef]) => {
      sliderRef.nativeElement.value = `${changedValue}`;
    })
  );

  commissionValueEffect = this.commissionValue$.pipe(
    this.rx.effect((value) => {
      this.comissionService.changeCommissionValue(value);
    })
  );

  constructor(
    private comissionService: CommissionService,
    private rx: RxOperatorService
  ) {}

  ngOnInit(): void {}

  private switchToInputValue() {
    return pipe(
      switchMap<ElementRef<HTMLInputElement>, Observable<number>>((ref) => {
        return fromEvent<Event>(ref.nativeElement, 'input').pipe(
          map(() => ref.nativeElement.valueAsNumber),
          startWith(ref.nativeElement.valueAsNumber),
          filter((value) => isFinite(value))
        );
      })
    );
  }
}

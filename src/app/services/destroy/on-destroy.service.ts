import { Injectable, OnDestroy } from '@angular/core';
import { AsyncSubject, MonoTypeOperatorFunction, pipe, takeUntil } from 'rxjs';

@Injectable()
export class OnDestroyService extends AsyncSubject<void> implements OnDestroy {
  takeUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
    return pipe(takeUntil(this));
  }

  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}

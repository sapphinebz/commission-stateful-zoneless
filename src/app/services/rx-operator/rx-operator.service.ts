import { Host, Injectable, Optional, Self } from '@angular/core';
import {
  MonoTypeOperatorFunction,
  Observable,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  filter,
  distinctUntilChanged,
  takeUntil,
  connectable,
  NEVER,
} from 'rxjs';
import { OnDestroyService } from '../destroy/on-destroy.service';

@Injectable()
export class RxOperatorService {
  constructor(@Self() @Optional() public onDestroy: OnDestroyService) {
    if (!this.onDestroy) {
      throw new Error('RxOperatorService need provide OnDestroyService');
    }
  }

  stateful<T>(defaultValue?: T): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => {
      const con$ = connectable(
        source.pipe(
          filter((state) => state !== undefined),
          distinctUntilChanged(),
          this.onDestroy.takeUntilDestroy()
        ),
        {
          connector: () => {
            if (defaultValue !== undefined) {
              return new BehaviorSubject<T>(defaultValue);
            } else {
              return new ReplaySubject<T>(1);
            }
          },
          resetOnDisconnect: false,
        }
      );

      con$.connect();
      return con$;
    };
  }

  actionful<T>() {
    return (source: Observable<T>) => {
      const con$ = connectable(source.pipe(this.onDestroy.takeUntilDestroy()), {
        connector: () => new Subject<T>(),
        resetOnDisconnect: false,
      });
      con$.connect();
      return con$;
    };
  }

  effect<T>(next: (value: T) => void) {
    return (source: Observable<T>) => {
      source.pipe(this.onDestroy.takeUntilDestroy()).subscribe(next);
      return NEVER;
    };
  }
}

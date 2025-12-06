import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  readonly #breakpointObserver = inject(BreakpointObserver);

  constructor() {}

  get isHandset(): boolean {
    return this.#breakpointObserver.isMatched(Breakpoints.Handset);
  }

  isHandset$: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  get isTablet(): boolean {
    return this.#breakpointObserver.isMatched(Breakpoints.Tablet);
  }

  isTablet$: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Tablet)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  get isWeb(): boolean {
    return this.#breakpointObserver.isMatched(Breakpoints.Web);
  }

  isWeb$: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );
}

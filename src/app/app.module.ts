import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommissionValueComponent } from './commission-value/commission-value.component';
import { CommissionTypeComponent } from './commission-type/commission-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  declarations: [
    AppComponent,
    CommissionValueComponent,
    CommissionTypeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';
import { CustomerTemplateComponent } from './customers/customer-template.component';
import { RatingValidator } from './customers/rating.validator';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    CustomerTemplateComponent,
    RatingValidator
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

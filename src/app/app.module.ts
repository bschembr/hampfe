import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DelorderComponent } from './delorder/delorder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

import { CustomerOrderService } from './shared_service/cust-order.service';
import { HttpModule } from '@angular/http';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DelnoteComponent } from './delnote/delnote.component';
import { DelNotesService } from './shared_service/del-notes.service';
import { DelnotecrudComponent } from './delnote/delnotecrud/delnotecrud.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DellistComponent } from './delnote/dellist/dellist.component';
import { DelnotedocComponent } from './shared_prints/delnotedoc/delnotedoc.component';
import { QzTrayService } from './shared_service/qz-tray.service';

const appRoutes: Routes = [
  {path: '', component: DelorderComponent},
  {path: 'delnotelist', component: DellistComponent},
  {path: 'print', component: DelnotedocComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DelorderComponent,
    DelnoteComponent,
    DelnotecrudComponent,
    DellistComponent,
    DelnotedocComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    MatDialogModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatDialogModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    CustomerOrderService,
    DelNotesService,
    QzTrayService,
    DelnotedocComponent
  ],
  entryComponents: [ DelnotecrudComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }

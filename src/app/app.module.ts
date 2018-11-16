import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DelorderComponent } from './delorder/delorder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
import { MenumainComponent } from './menu/menumain/menumain.component';
import { SearchSelectModule } from '@oasisdigital/angular-material-search-select';
import { SelectClientMatTableComponent } from './select-client-mat-table/select-client-mat-table.component';
import { DocSelectComponent } from './delnote/docselect/docselect.component';
import { LabeldocComponent } from './shared_prints/labeldoc/labeldoc.component';
import { DelorderlistComponent } from './delorder/delorderlist/delorderlist.component';
import { EyeselInvdetailsService } from './shared_service/eyesel-invdetails.service';

const appRoutes: Routes = [
  {path: '', component: MenumainComponent},
  {path: 'delorder', component: DelorderComponent},
  {path: 'delnotelist', component: DellistComponent},
  {path: 'orderlist', component: DelorderlistComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DelorderComponent,
    DelnoteComponent,
    DelnotecrudComponent,
    DellistComponent,
    DelnotedocComponent,
    MenumainComponent,
    SelectClientMatTableComponent,
    DocSelectComponent,
    LabeldocComponent,
    DelorderlistComponent
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
    MatDialogModule,
    SearchSelectModule,
    MatButtonToggleModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatDialogModule,
    DelnotedocComponent,
    DocSelectComponent,
    LabeldocComponent,
    MatButtonToggleModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    CustomerOrderService,
    DelNotesService,
    QzTrayService,
    EyeselInvdetailsService,
    DelnotedocComponent,
    DocSelectComponent,
    LabeldocComponent
  ],
  entryComponents: [ DelnotecrudComponent, DelnotedocComponent, DocSelectComponent, LabeldocComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }

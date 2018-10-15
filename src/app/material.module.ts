import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule
    ],
    exports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule
    ]
})
export class MaterialModule {}

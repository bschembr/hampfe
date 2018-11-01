import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';

import { SearchSelectBase, OptionEntry } from '@oasisdigital/angular-material-search-select';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-select-client-mat-table',
  templateUrl: './select-client-mat-table.component.html',
  styleUrls: ['./select-client-mat-table.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectClientMatTableComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class SelectClientMatTableComponent extends SearchSelectBase implements DataSource<OptionEntry> {

  @Input() placeholder: string;
  @Input() width: string;

  displayedColumns = ['account', 'name', 'town'];

  // For conciseness of implementation, the mat-table (CDK) DataSource is simply
  // implemented here, in the component class. A more complex component may need
  // to split out one or more data sources to separate classes.

  connect() {
    return this.list.pipe(
      filter(list => !!list),
      map((optionEntries: OptionEntry[]) => optionEntries)
    );
  }

  disconnect() {

  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-docselect',
  templateUrl: './docselect.component.html',
  styleUrls: ['./docselect.component.css']
})

export class DocSelectComponent {
    checkDelnote = false;
    checkLabel = false;

    docselectform: FormGroup = new FormGroup({
      CheckBoxDelnote: new FormControl(false),
      CheckBoxLabel: new FormControl(false),
    });

  constructor(public dialog: MatDialog) {}


toggledelnote() {
  this.checkDelnote = !this.checkDelnote;
}

togglelabel() {
  this.checkLabel = !this.checkLabel;
}

}


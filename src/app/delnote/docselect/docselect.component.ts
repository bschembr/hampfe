import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
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
    CheckBoxDelNote: new FormControl(false),
    CheckBoxLabel: new FormControl(false),
  });

  constructor(public dialogRef: MatDialogRef<any>) { }


  toggledelnote() {
    this.checkDelnote = !this.checkDelnote;
  }

  togglelabel() {
    this.checkLabel = !this.checkLabel;
  }

  onPrint() {
    this.dialogRef.close({delnote: this.checkDelnote, label: this.checkLabel});
  }

  onCancel() {
    this.dialogRef.close('Canceled');
  }

}


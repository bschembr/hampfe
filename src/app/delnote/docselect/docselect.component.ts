import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-docselect',
  templateUrl: './docselect.component.html',
  styleUrls: ['./docselect.component.css']
})

export class DocSelectComponent implements OnInit {
  checkDelnote = false;
  checkLabel = false;

  docselectform: FormGroup = new FormGroup({
    CheckBoxDelNote: new FormControl(false),
    CheckBoxLabel: new FormControl(false),
  });

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private showSaveButton: boolean) { }

  ngOnInit() {
      console.log(this.showSaveButton);
  }

  toggledelnote() {
    this.checkDelnote = !this.checkDelnote;
  }

  togglelabel() {
    this.checkLabel = !this.checkLabel;
  }

  onSaveAndPrint() {
    this.dialogRef.close({delnote: this.checkDelnote, label: this.checkLabel});
  }

  onSaveOnly() {
    this.dialogRef.close('SaveOnly');
  }

  onCancel() {
    this.dialogRef.close('Canceled');
  }

}


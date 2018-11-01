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

  openDialog(): void {
    const dialogRef = this.dialog.open(DocSelectComponent, {
      width: '120px',
      height: '120px',
      data: {checkDelnote: this.checkDelnote, checkLabel: this.checkLabel},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogData => {

      if (dialogData !== 'Canceled') {
        this.delnotearray.push(dialogData);
        this.listData.data = this.delnotearray;
      }
    });
}

toggledelnote() {
  this.checkDelnote = !this.checkDelnote;
}

togglelabel() {
  this.checkLabel = !this.checkLabel;
}

}


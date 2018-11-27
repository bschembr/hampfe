import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialog,
  MatDialogRef
} from '@angular/material';
import { CustomerOrder } from '../../customerorder';
import { CustomerOrderService } from '../../shared_service/cust-order.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DelnotedocComponent } from '../../shared_prints/delnotedoc/delnotedoc.component';
import { QzTrayService } from '../../shared_service/qz-tray.service';
import { LabeldocComponent } from 'src/app/shared_prints/labeldoc/labeldoc.component';
import { Observable } from 'rxjs';
import { DocSelectComponent } from 'src/app/delnote/docselect/docselect.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delorderlist',
  templateUrl: './delorderlist.component.html',
  styleUrls: ['./delorderlist.component.css']
})
export class DelorderlistComponent implements OnInit {
  showdelnotes = false;
  selectedorder: number;
  subscribe: any;
  job: string[] = [];
  isMasterCheckBoxSelected = false;

  constructor(public dialog: MatDialog,
    private _customerOrderService: CustomerOrderService,
    // public printdialog: MatDialog,
    public printdialogdelnote: MatDialog,
    public printdialoglabel: MatDialog,
    private _router: Router,
    private printEngine: QzTrayService) {
  }
  showSpinner = true;

  selectionOrder = new SelectionModel<CustomerOrder>(true, []);
  ordersarray: CustomerOrder[] = new Array();

  listDataOrders: MatTableDataSource<CustomerOrder>;

  displayedColumnsOrders: string[] = ['delordref', 'custname', 'custtown', 'delorddate', 'invoiceref', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchKey = '';

  ngOnInit() {

    this.listDataOrders = new MatTableDataSource(this.ordersarray);
    this.listDataOrders.sort = this.sort;
    this.listDataOrders.paginator = this.paginator;

    this._customerOrderService.getOrders().subscribe(list => {
      list.forEach(element => {
        this.ordersarray.push(element);
        this.listDataOrders.data = this.ordersarray;
        this.showSpinner = false;
      });
    });

  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listDataOrders.filter = this.searchKey.trim().toLowerCase();
  }

  getRowPaginator(row: number) {
    let rowindex = 0;

    if (this.paginator.pageIndex === 0) {
      rowindex = row;
    } else {
      rowindex = ((this.paginator.pageIndex * this.paginator.pageSize) + row);
    }
    return rowindex;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.listDataOrders.data.length;
    // return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleOrders() {
    let startrow = 0;
    let endrow = 0;
    let pagesmodulus = 0;
    this.isMasterCheckBoxSelected = !this.isMasterCheckBoxSelected;
    if (this.isMasterCheckBoxSelected) {
      console.log('check ticks');
      console.log('pageIndex: ' + this.paginator.pageIndex + ' pageSize: ' + this.paginator.pageSize);

      if (this.paginator.pageIndex > 0) {
        startrow = (this.paginator.pageSize * this.paginator.pageIndex);
        pagesmodulus = this.listDataOrders.data.length % this.paginator.pageSize;
        if (pagesmodulus === 0) {
          endrow = pagesmodulus;
        } else {
          if (this.paginator.getNumberOfPages() === this.paginator.pageIndex) {
            endrow = (startrow + pagesmodulus) - 1;
          } else {
            endrow = ((this.paginator.pageSize - 1) + startrow);
          }
        }
      } else {
        startrow = 0;
        pagesmodulus = this.listDataOrders.data.length % this.paginator.pageSize;
        if (pagesmodulus === 0) {
          endrow = (this.paginator.pageSize - 1);
        } else {
          endrow = pagesmodulus - 1;
        }
      }

      console.log('pagesmodulus: ' + pagesmodulus + ' start row: ' + startrow + ' end row: ' + endrow + ' num of pages: '
        + this.paginator.getNumberOfPages());

      for (let i = startrow; i <= endrow; i++) {
        this.selectionOrder.select(this.listDataOrders.data[i]);
      }
    } else {
      this.selectionOrder.clear();
      console.log('clear');
    }
  }

  onGetDelNotes(row: number) {
    this.selectedorder = this.listDataOrders.filteredData[this.getRowPaginator(row)].delOrdRef;
    this.showdelnotes = true;
  }

  onRefresh() {
    this.showSpinner = true;
    this.ordersarray.length = 0;
    this._customerOrderService.getOrders().subscribe(list => {
      list.forEach(element => {
        this.ordersarray.push(element);
        this.listDataOrders.data = this.ordersarray;
      });
      this.showSpinner = false;
    });
  }
  onBackButton() {
    this._router.navigate(['/']);
  }
}

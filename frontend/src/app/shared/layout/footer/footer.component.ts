import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PopupCallComponent} from "../../components/popup-call/popup-call.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openPopup() {
    this.dialog.open(PopupCallComponent, {
      width: '727px',
      height: '489px'
    })
  }

}

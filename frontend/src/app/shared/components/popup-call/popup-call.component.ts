import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {RequestService} from "../../services/request.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-popup-call',
  templateUrl: './popup-call.component.html',
  styleUrls: ['./popup-call.component.scss']
})
export class PopupCallComponent implements OnInit {

  popupForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });
  hasError: boolean = false;
  isSuccess: boolean = false;
  constructor(private dialogRef: MatDialogRef<PopupCallComponent>,
              private requestService: RequestService,
              private fb: FormBuilder) { }

  close() {
    this.dialogRef.close();
  }

  send() {
    if (this.popupForm.valid && this.popupForm.value.name && this.popupForm.value.phone) {
      this.requestService.sendRequest(this.popupForm.value.name, this.popupForm.value.phone)
        .subscribe(response => {
          if (response.error) {
            this.hasError = true;
          } else {
            this.isSuccess = true;
          }
        })
    }
  }

  ngOnInit(): void {
  }

}

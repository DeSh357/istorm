import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RequestService} from "../../services/request.service";

@Component({
  selector: 'app-popup-service',
  templateUrl: './popup-service.component.html',
  styleUrls: ['./popup-service.component.scss']
})
export class PopupServiceComponent implements OnInit {

  popupForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    service: [this.data.selectedService || '', [Validators.required]],
  });
  hasError: boolean = false;
  isSuccess: boolean = false;
  services = [
    'Создание сайтов',
    'Реклама',
    'Копирайтинг',
    'Продвижение'
  ]

  constructor(private dialogRef: MatDialogRef<PopupServiceComponent>,
              private requestService: RequestService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { selectedService?: string }) { }

  close() {
    this.dialogRef.close();
  }

  send() {
    if (this.popupForm.valid && this.popupForm.value.name && this.popupForm.value.phone && this.popupForm.value.service) {
      this.requestService.sendRequest(this.popupForm.value.name, this.popupForm.value.phone, 'order', this.popupForm.value.service)
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

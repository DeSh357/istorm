import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  sendRequest(name: string, phone: string, type = 'consultation', service?: string): Observable<DefaultResponseType> {
    const data: {name: string, phone: string, type: string, service?: string} = {
      name, phone, type
    }
    if (service) {
      data.service = service;
    }
    return this.http.post<DefaultResponseType>(environment.api + 'requests', data);
  }
}

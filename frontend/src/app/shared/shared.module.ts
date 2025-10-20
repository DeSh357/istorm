import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterLinkWithHref} from "@angular/router";
import { LoaderComponent } from './components/loader/loader.component';
import { CardTextPipe } from './pipes/card-text.pipe';
import { PopupCallComponent } from './components/popup-call/popup-call.component';
import {ReactiveFormsModule} from "@angular/forms";
import { PopupServiceComponent } from './components/popup-service/popup-service.component';



@NgModule({
  declarations: [
    ArticleCardComponent,
    LoaderComponent,
    CardTextPipe,
    PopupCallComponent,
    PopupServiceComponent,
  ],
  exports: [
    ArticleCardComponent,
    LoaderComponent,
  ],
    imports: [
        CommonModule,
        RouterLinkWithHref,
        ReactiveFormsModule
    ]
})
export class SharedModule { }

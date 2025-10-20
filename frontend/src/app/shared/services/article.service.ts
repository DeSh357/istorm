import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ArticleCardType} from "../../../types/article-card.type";
import {environment} from "../../../environments/environment";
import {ArticlesResponseType} from "../../../types/articles-response.type";
import {CategoryType} from "../../../types/category.type";
import {ActiveFiltersType} from "../../../types/active-filters.type";
import {ArticleType} from "../../../types/article.type";
import {ArticleFinishedType} from "../../../types/article-finished.type";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getPopularArticles(): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(environment.api + 'articles/top');
  }

  getArticles(params: ActiveFiltersType): Observable<ArticlesResponseType> {
    return this.http.get<ArticlesResponseType>(environment.api + 'articles', {
      params: params
    });
  }

  getRelatedArticles(articleUrl: string): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(environment.api + 'articles/related/' + articleUrl);
  }



  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }

  getArticle(url: string): Observable<ArticleFinishedType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
      .pipe(
        map(article => {
          const articleNew : ArticleFinishedType = {
            text: this.sanitize(article.text),
            comments: article.comments,
            commentsCount: article.commentsCount,
            id: article.id,
            title: article.title,
            description: article.description,
            image: article.image,
            date: article.date,
            category: article.category,
            url: article.url
          }

          return articleNew;
        })
      )
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}

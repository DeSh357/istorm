import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CommentsResponseType} from "../../../types/comments-response.type";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {text} from "node:stream/consumers";
import {ActionType} from "../../../types/action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getComments(offset: number, id: string): Observable<CommentsResponseType> {
    return this.http.get<CommentsResponseType>(environment.api + 'comments?offset=' + offset + '&article=' + id);
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {text, article})
  }

  sendAction(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action})
  }

  getActions(articleId: string): Observable<ActionType[]> {
    return this.http.get<ActionType[]>(environment.api + 'comments/article-comment-actions?articleId=' + articleId)
  }

  getAction(commentId: string): Observable<ActionType[]> {
    return this.http.get<ActionType[]>(environment.api + 'comments/' + commentId + '/actions');
  }

}

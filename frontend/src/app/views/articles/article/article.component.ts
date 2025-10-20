import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../../environments/environment";
import {ArticleFinishedType} from "../../../../types/article-finished.type";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {FormControl, Validators} from "@angular/forms";
import {ActionType} from "../../../../types/action.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticleCardType} from "../../../../types/article-card.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: ArticleFinishedType | null = null;
  commentsCount: number = 0;
  comments: CommentType[] = [];
  isLogged = this.authService.getIsLoggedIn();
  serverStaticPath = environment.serverStaticPath;
  commentInput = new FormControl('', Validators.required);
  isLoadingComments = false;
  offset = 0;
  actions: ActionType[] = [];
  relatedArticles: ArticleCardType[] = [];

  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService,
              private commentService: CommentService, private authService: AuthService,
              private router: Router, private _snackBar: MatSnackBar) {
    this.authService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe(article => {
          this.article = article;
          if (!article) {
            this._snackBar.open('Статья не найдена');
            this.router.navigate(['/articles']);
          }

          if (this.isLogged) {
            this.getActions();
          } else {
            this.getComments();
          }

          this.articleService.getRelatedArticles(this.article.url)
            .subscribe(articles => {
              this.relatedArticles = articles;
              console.log(this.relatedArticles);
            })
        });
    });
  }

  getActions() {
    if (this.article) {
      this.commentService.getActions(this.article.id)
        .subscribe(actions => {
          this.actions = actions;

          this.getComments();
        });
    }
  }

  getComments(isLoadMore = false) {
    if (!this.article) return;
    this.isLoadingComments = true;
    const offsetToSend = isLoadMore ? this.offset : 0;

    this.commentService.getComments(offsetToSend, this.article.id)
      .subscribe(comments => {
        if (!isLoadMore) {
          this.comments = comments.comments.slice(0, 3);
          this.updateActions(this.comments);
          this.offset = 3;
        } else {
          this.updateActions(comments.comments);
          this.comments.push(...comments.comments);
          this.offset += 10;
        }

        this.commentsCount = comments.allCount;
        this.isLoadingComments = false;
      });
  }

  sendComment() {
    if (this.commentInput.valid && this.commentInput.value && this.article) {
      this.commentService.addComment(this.commentInput.value, this.article.id)
        .subscribe(response => {
          if (response.error) {
            this._snackBar.open('Ошибка при добавлении комментария');
          } else {
            this.commentInput.setValue('');
            this.offset = 0;
            this.comments = [];
            this.getComments();
          }
        })
    }
  }

  sendAction(comment: CommentType, action: 'like' | 'dislike') {
    if (this.isLogged) {
      this.commentService.sendAction(comment.id, action)
        .subscribe(response => {
          if (response.error) {
            this._snackBar.open('Ошибка при добавлении действия');
          } else {
            this.updateAction(comment);
            this._snackBar.open('Ваш голос учтен');
          }
        });
    } else {
      this._snackBar.open('Войдите или зарегистрируйтесь, чтобы оставлять реакции');
    }
  }

  sendSpam(comment: CommentType) {
    if (this.isLogged) {
      this.commentService.sendAction(comment.id, 'violate')
        .subscribe({
          next: (response) => {
            if (response.error) {
              this._snackBar.open('Ошибка при добавлении действия');
            } else {
              this._snackBar.open('Жалоба отправлена');
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this._snackBar.open('Жалоба уже отправлена');
          }
        })
    } else {
      this._snackBar.open('Войдите или зарегистрируйтесь, чтобы оставлять реакции');
    }
  }

  updateActions(comments: CommentType[]) {
    comments.forEach((comment) => {
      const activeAction = (this.actions.find(action => {
        return action.comment === comment.id;
      }));
      if (activeAction) {
        if (activeAction.action === 'like') {
          comment.isLiked = true;
        } else if (activeAction.action === 'dislike') {
          comment.isDisliked = true;
        }
      }
    })
  }

  updateAction(comment: CommentType) {
    this.commentService.getAction(comment.id).subscribe(actions => {
      const action = actions[0]?.action ?? null;

      if (!action) {
        if (comment.isLiked) comment.likesCount--;
        if (comment.isDisliked) comment.dislikesCount--;
        comment.isLiked = false;
        comment.isDisliked = false;
        return;
      }

      const isLike = action === 'like';
      const isDislike = action === 'dislike';

      if (isLike) {
        if (!comment.isLiked) comment.likesCount++;
        if (comment.isDisliked) comment.dislikesCount--;
        comment.isLiked = true;
        comment.isDisliked = false;
      }

      if (isDislike) {
        if (!comment.isDisliked) comment.dislikesCount++;
        if (comment.isLiked) comment.likesCount--;
        comment.isDisliked = true;
        comment.isLiked = false;
      }
    });
  }


}

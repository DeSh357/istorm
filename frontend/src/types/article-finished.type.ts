import {SafeHtml} from "@angular/platform-browser";

export type ArticleFinishedType = {
  text: SafeHtml,
  comments: string[],
  commentsCount: number,
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string
}

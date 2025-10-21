import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {CarouselSliderType} from "../../../types/carousel-slider.type";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ServicesItemType} from "../../../types/services-item.type";
import {environment} from "../../../environments/environment";
import {ArticleCardType} from "../../../types/article-card.type";
import {ArticleService} from "../../shared/services/article.service";
import {MatDialog} from "@angular/material/dialog";
import {PopupServiceComponent} from "../../shared/components/popup-service/popup-service.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoWidth: true,
    dots: true,
    dotsData: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      }
    }
  }
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3,
      }
    },
    nav: false
  }
  services: ServicesItemType[] = [
    {
      name: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500,
    },
    {
      name: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500
    },
    {
      name: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000
    },
    {
      name: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750
    },
  ];
  sliders: CarouselSliderType[] = [];
  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },

  ];

  serverStaticPath = environment.serverStaticPath;
  articles: ArticleCardType[] = [];

  constructor(private sanitizer: DomSanitizer, private articleService: ArticleService,
              private dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.sliders = [
      {
        type: 'Предложение месяца',
        title: this.sanitize('Продвижение в Instagram для вашего бизнеса <span>-15%</span>!'),
        service: 'Продвижение'
      },
      {
        type: 'Акция',
        title: this.sanitize('Нужен грамотный <span>копирайтер</span>?'),
        description: 'Весь декабрь у нас действует акция на работу копирайтера.',
        service: 'Копирайтинг'
      },
      {
        type: 'Новость дня',
        title: this.sanitize('<span>6 место</span> в ТОП-10 SMM-агенств Москвы!'),
        description: 'Мы благодарим каждого, кто голосовал за нас!',
        service: 'Продвижение'
      }
    ];

    this.articleService.getPopularArticles()
      .subscribe((articles: ArticleCardType[]) => {
        this.articles = articles;
      });
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  openPopup(service: string) {
    this.dialog.open(PopupServiceComponent, {
      width: '727px',
      height: '489px',
      data: {selectedService: service}
    })
  }

}

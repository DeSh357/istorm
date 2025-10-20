import {Component, HostListener, OnInit} from '@angular/core';
import {ArticleCardType} from "../../../../types/article-card.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticlesResponseType} from "../../../../types/articles-response.type";
import {CategoryType} from "../../../../types/category.type";
import {ActiveFiltersType} from "../../../../types/active-filters.type";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticleCardType[] = [];
  filterOpen: boolean = false;
  categories: CategoryType[] = [];
  pages: number[] = [];
  appliedFilters: CategoryType[] = []
  activeFilters: ActiveFiltersType = {categories: []};

  constructor(private articleService: ArticleService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.filterOpen && (event.target as HTMLElement).parentElement?.className.indexOf('blog-filter') === -1) {
      this.filterOpen = false;
    }
  }

  ngOnInit(): void {
    this.articleService.getCategories()
      .subscribe(categories => {
        this.categories = categories;

        this.activatedRoute.queryParams.subscribe((params) => {
          if (params.hasOwnProperty('categories')) {
            this.activeFilters.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
            this.appliedFilters = this.categories.filter(category => {
              return this.activeFilters.categories.includes(category.url);
            });
          }
          if (params.hasOwnProperty('page')) {
            this.activeFilters.page = +params['page'];
          }
          this.articleService.getArticles(this.activeFilters)
            .subscribe((articles: ArticlesResponseType) => {
              this.articles = articles.items;
              this.pages = Array.from({length: articles.pages}, (_, i) => i + 1);
            });
        })
      });
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  openPrevPage() {
    if (this.activeFilters.page && this.activeFilters.page > 1) {
      this.activeFilters.page--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeFilters
      });
    }
  }

  openNextPage() {
    if (!this.activeFilters.page) {
      this.activeFilters.page = 1;
    }
    if (this.activeFilters.page < this.pages.length) {
      this.activeFilters.page++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeFilters
      });
    }
  }

  openPage(page: number) {
    this.activeFilters.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeFilters
    });
  }

  updateFilterParams(category: CategoryType, isActive: boolean) {
    if (isActive) {
      this.activeFilters.categories = this.activeFilters.categories.filter(item => item !== category.url);
      this.appliedFilters.filter(appliedFilter => appliedFilter.name !== category.name);
    } else {
      this.activeFilters.categories = this.activeFilters.categories.concat(category.url);
      this.appliedFilters.push(category);
    }

    this.activeFilters.page = 1;

    this.router.navigate(['/articles'], {
      queryParams: this.activeFilters
    });
  }

}

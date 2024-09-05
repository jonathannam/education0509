import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {
  ELASTIC_SEARCH_ENGINE,
  WebCrawlerManagementStore,
} from './web-crawler-management.store';
import { NzSelectModule } from 'ng-zorro-antd/select';

interface ExportType {
  type: 'csv' | 'mongo';
  icon: string;
  label: string;
}
@Component({
  selector: 'app-web-crawler-management',
  standalone: true,
  imports: [
    FormsModule,
    NzInputModule,
    NzPaginationModule,
    NzButtonModule,
    DatePipe,
    NzSpinModule,
    NzDropDownModule,
    NzIconModule,
    NgTemplateOutlet,
    NzSelectModule,
  ],
  templateUrl: './web-crawler-management.component.html',
  styleUrl: './web-crawler-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WebCrawlerManagementStore],
})
export class WebCrawlerManagementComponent {
  @ViewChild('topElement') topElement!: ElementRef;
  readonly webCrawlerManagementStore = inject(WebCrawlerManagementStore);
  readonly exportTypeOptions: ExportType[] = [
    {
      type: 'csv',
      icon: 'file-excel',
      label: 'Excel File',
    },
    {
      type: 'mongo',
      icon: 'database',
      label: 'MongoDB',
    },
  ];
  readonly engineTypeOption = Object.values(ELASTIC_SEARCH_ENGINE).map((i) => ({
    value: i,
    label: i,
  }));
  engineType = this.webCrawlerManagementStore.queryParams().engine;
  query = '';

  changePageIndex(index: number): void {
    this.#scrollToTop();
    this.webCrawlerManagementStore.changePageIndex(index);
  }

  #scrollToTop(): void {
    this.topElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse, ElasticSearchResponse, PagingQueryParams } from '../models';

export interface ElasticSearchRequest extends PagingQueryParams {
  query: string;
  engine: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebCrawlerManagementService {
  readonly #httpClient = inject(HttpClient);

  search(params: ElasticSearchRequest): Observable<BaseResponse<ElasticSearchResponse>> {
    return this.#httpClient.get<BaseResponse<ElasticSearchResponse>>(
      'api/web-crawler-management',
      {
        params: {
          ...params,
        },
      },
    );
  }

  exportData(query: string, engine: string, exportType: 'csv' | 'mongo'): Observable<Blob> {
    return this.#httpClient.get('api/web-crawler-management/export-data', {
      params: {
        query,
        engine,
        exportType,
      },
      responseType: 'blob',
    });
  }
}

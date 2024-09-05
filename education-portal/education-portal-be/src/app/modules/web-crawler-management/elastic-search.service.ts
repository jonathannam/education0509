import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ElasticSearchResponse, SearchResult } from './elastic-search.model';

@Injectable()
export class ElasticSearchService {
  constructor(private readonly httpService: HttpService) {}

  private readonly elasticSearchUrl =
    'https://naep-demo.ent.us-east-1.aws.found.io/api/as/v1/engines/ca2-sd-urls/search.json';
  private readonly apiKey = 'search-jcxmex45s6k95jydkg26uifp';

  private getElasticSearchUrl(engine: string): string {
    return `https://naep-demo.ent.us-east-1.aws.found.io/api/as/v1/engines/${engine}/search.json`;
  }

  async handleExport(
    query: string,
    engine: string,
    exportType: 'csv' | 'mongo',
  ): Promise<string> {
    const results = await this.fetchAllData(query, engine);
    const fileContent =
      exportType === 'csv'
        ? this.exportToCSV(results)
        : this.exportToMongoScript(results);

    return fileContent;
  }

  async fetchDataElasticSearch(
    query: string,
    engine: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<ElasticSearchResponse> {
    const res = await lastValueFrom(
      this.httpService.post<ElasticSearchResponse>(
        this.getElasticSearchUrl(engine),
        {
          query,
          page: {
            size: pageSize,
            current: pageIndex,
          },
          result_fields: {
            body_content: { raw: {}, snippet: { size: 100, fallback: true } },
            domains: { raw: {}, snippet: { size: 100, fallback: true } },
            headings: { raw: {}, snippet: { size: 100, fallback: true } },
            id: { raw: {}, snippet: { size: 100, fallback: true } },
            links: { raw: {}, snippet: { size: 100, fallback: true } },
            meta_description: {
              raw: {},
              snippet: { size: 100, fallback: true },
            },
            meta_keywords: { raw: {}, snippet: { size: 100, fallback: true } },
            title: { raw: {}, snippet: { size: 100, fallback: true } },
            url: { raw: {}, snippet: { size: 100, fallback: true } },
            url_host: { raw: {}, snippet: { size: 100, fallback: true } },
            url_path: { raw: {}, snippet: { size: 100, fallback: true } },
            url_path_dir1: { raw: {}, snippet: { size: 100, fallback: true } },
            url_path_dir2: { raw: {}, snippet: { size: 100, fallback: true } },
            url_path_dir3: { raw: {}, snippet: { size: 100, fallback: true } },
            url_port: { raw: {}, snippet: { size: 100, fallback: true } },
            url_scheme: { raw: {}, snippet: { size: 100, fallback: true } },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      ),
    );
    return res.data;
  }

  private async fetchAllData(
    query: string,
    engine: string,
  ): Promise<Partial<SearchResult>[]> {
    let currentPage = 1;
    const size = 100;
    let allResults: Partial<SearchResult>[] = [];

    while (currentPage <= 100) {
      const response = await this.fetchDataElasticSearch(
        query,
        engine,
        currentPage,
        size,
      );

      if (!response.results || response.results.length === 0) break;
      allResults = allResults.concat(response.results);
      currentPage++;
    }

    return allResults;
  }

  private exportToCSV(results: Partial<SearchResult>[]): string {
    const csvRows = [];
    const headers = [
      'ID',
      'Title',
      'Body Content',
      'Links',
      'Headings',
      'Last Crawled At',
      'URL',
      'Additional URLs',
      'Domains',
      'URL Scheme',
      'URL Host',
      'URL Port',
      'URL Path',
      'Dir1',
      'Dir2',
    ];

    csvRows.push(headers.join(','));

    results.forEach((result) => {
      const row = [
        result.id?.raw,
        result.title?.raw,
        result.body_content?.raw,
        result.links?.raw.join(' | '),
        result.headings?.raw,
        result.last_crawled_at?.raw,
        result.url?.raw,
        result.additional_urls?.raw.join(' | '),
        result.domains?.raw.join(' | '),
        result.url_scheme?.raw,
        result.url_host?.raw,
        result.url_port?.raw,
        result.url_path?.raw,
        result.url_path_dir1?.raw,
        result.url_path_dir2?.raw,
      ];
      csvRows.push(row.map((val) => `"${val}"`).join(','));
    });

    return csvRows.join('\n');
  }

  private exportToMongoScript(results: Partial<SearchResult>[]): string {
    const mongoScript = results
      .map((result) => {
        return `db.searchResults.insert(${JSON.stringify(result)});`;
      })
      .join('\n');

    return mongoScript;
  }
}

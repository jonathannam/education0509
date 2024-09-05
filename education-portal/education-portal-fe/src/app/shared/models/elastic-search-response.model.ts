export interface ElasticSearchResponse {
  meta: {
    page: PageMetaData;
  };
  results: Partial<SearchResult>[];
}

export interface PageMetaData {
  current: number;
  total_pages: number;
  total_results: number;
  size: number;
}

export interface SearchResult {
  title: FieldContent;
  body_content: FieldContent;
  links: FieldContentArray;
  headings: FieldContent;
  last_crawled_at: FieldContent | null;
  url: FieldContent;
  additional_urls: FieldContentArray;
  domains: FieldContentArray;
  url_scheme: FieldContent;
  url_host: FieldContent;
  url_port: FieldContent;
  url_path: FieldContent;
  url_path_dir1: FieldContent;
  url_path_dir2: FieldContent;
  id: FieldContent;
  _meta: MetaData;
}

export interface FieldContent {
  raw: string;
  snippet: string | null;
}

export interface FieldContentArray {
  raw: string[];
  snippet: string | null;
}

export interface MetaData {
  id: string;
  engine: string;
  score: number;
}

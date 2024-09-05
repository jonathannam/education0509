import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { pipe, switchMap, tap } from 'rxjs';
import { DEFAULT_PAGE_INDEX } from '../shared/consts';
import { ElasticSearchResponse } from '../shared/models';
import {
  ElasticSearchRequest,
  WebCrawlerManagementService,
} from '../shared/services';

export const ELASTIC_SEARCH_ENGINE = {
  CA: 'ca2-sd-urls',
  AK: 'ak2-sd-urls',
  NH: 'nh2-sd-urls',
  ME: 'me2-sd-urls',
  WV: 'wv2-sd-urls',
} as const;

interface WebCrawlerManagementState {
  vm: ElasticSearchResponse;
  isLoading: boolean;
  queryParams: ElasticSearchRequest;
}

const initialState: WebCrawlerManagementState = {
  vm: {
    meta: {
      page: {
        current: DEFAULT_PAGE_INDEX,
        total_pages: 0,
        total_results: 0,
        size: 100,
      },
    },
    results: [],
  },
  queryParams: {
    query: '',
    engine: ELASTIC_SEARCH_ENGINE.CA,
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: 100,
  },
  isLoading: false,
};

export const WebCrawlerManagementStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      webCrawlerManagementService = inject(WebCrawlerManagementService),
      nzMessage = inject(NzMessageService),
    ) => {
      function loadElasticSearchData() {
        patchState(store, { isLoading: true });
        return webCrawlerManagementService.search(store.queryParams()).pipe(
          tapResponse({
            next: (res) => {
              patchState(store, { vm: res.data });
            },
            error: (err: HttpErrorResponse) => {
              nzMessage.error(err.error.message);
              patchState(store, {
                vm: {
                  meta: {
                    page: {
                      current: 1,
                      total_pages: 0,
                      total_results: 0,
                      size: 10,
                    },
                  },
                  results: [],
                },
              });
            },
            finalize: () => {
              patchState(store, { isLoading: false });
            },
          }),
        );
      }

      const changePageIndex = rxMethod<number>(
        pipe(
          switchMap((pageIndex) => {
            patchState(store, (state) => ({
              queryParams: {
                ...state.queryParams,
                pageIndex,
              },
            }));
            return loadElasticSearchData();
          }),
        ),
      );

      const searchQuery = rxMethod<string>(
        pipe(
          switchMap((query) => {
            patchState(store, (state) => ({
              queryParams: {
                ...state.queryParams,
                query,
              },
            }));
            return loadElasticSearchData();
          }),
        ),
      );

      const changeEngine = (engine: string) => {
        patchState(store, (state) => ({
          queryParams: {
            ...state.queryParams,
            engine,
          },
        }));
      };
      const exportData = rxMethod<'csv' | 'mongo'>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((exportType) =>
            webCrawlerManagementService
              .exportData(
                store.queryParams().query!,
                store.queryParams().engine,
                exportType,
              )
              .pipe(
                tapResponse({
                  next: (data) => {
                    downloadFile(data, exportType);
                  },
                  error: (err: HttpErrorResponse) => {
                    nzMessage.error(err.error.message);
                  },
                  finalize: () => {
                    patchState(store, { isLoading: false });
                  },
                }),
              ),
          ),
        ),
      );

      function downloadFile(data: Blob, exportType: 'csv' | 'mongo') {
        const blob = new Blob([data], {
          type: exportType === 'csv' ? 'text/csv' : 'application/javascript',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export.${exportType}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      return {
        changePageIndex,
        searchQuery,
        exportData,
        changeEngine,
      };
    },
  ),
);

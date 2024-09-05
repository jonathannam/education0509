import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  AuthGuard,
  Authorize,
  PermissionsGuard,
} from 'src/app/infrastructures/auth';
import { PERMISSION } from 'src/app/infrastructures/constants';
import { ElasticSearchService } from './elastic-search.service';

@ApiTags('web-crawler-management')
@Controller({
  path: 'web-crawler-management',
})
export class WebCrawlerManagementController {
  constructor(private readonly elasticSearchService: ElasticSearchService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.WebCrawlerManagement)
  async getWebCrawlerData(
    @Query('query') query: string,
    @Query('engine') engine: string,
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('pageIndex', new ParseIntPipe()) pageIndex: number,
  ) {
    return await this.elasticSearchService.fetchDataElasticSearch(
      query,
      engine,
      pageIndex,
      pageSize,
    );
  }

  @ApiQuery({
    name: 'exportType',
    required: true,
    description: 'Type of export. Must be either "csv" or "mongo".',
    enum: ['csv', 'mongo'],
  })
  @Get('export-data')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.WebCrawlerManagement)
  async exportData(
    @Query('query') query: string,
    @Query('engine') engine: string,
    @Query('exportType') exportType: 'csv' | 'mongo',
    @Res() res: Response,
  ) {
    const result = await this.elasticSearchService.handleExport(
      query,
      engine,
      exportType,
    );

    const contentType =
      exportType === 'csv' ? 'text/csv' : 'application/javascript';
    const fileExtension = exportType === 'csv' ? 'csv' : 'js';

    res.header('Content-Type', contentType);
    res.attachment(`export.${fileExtension}`);
    res.send(result);
  }
}

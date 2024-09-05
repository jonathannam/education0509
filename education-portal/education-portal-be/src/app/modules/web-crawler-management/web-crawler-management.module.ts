import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ElasticSearchService } from './elastic-search.service';
import { WebCrawlerManagementController } from './web-crawler-management.controller';

@Module({
  imports: [HttpModule],
  providers: [ElasticSearchService],
  controllers: [WebCrawlerManagementController],
})
export class WebCrawlerManagementModule {}

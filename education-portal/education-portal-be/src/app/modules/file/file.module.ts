import { Module } from '@nestjs/common';
import { S3Module } from 'src/app/infrastructures/s3';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  imports: [S3Module],
})
export class FileModule {}

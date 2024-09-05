import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthGuard,
  Authorize,
  PermissionsGuard,
} from 'src/app/infrastructures/auth';
import { PERMISSION } from 'src/app/infrastructures/constants';
import { S3Service } from 'src/app/infrastructures/s3';

@ApiTags('file')
@Controller({
  path: 'files',
})
export class FileController {
  constructor(private s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.UploadFile)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.s3Service.uploadSingleFile({ file, isPublic: true });
  }
}

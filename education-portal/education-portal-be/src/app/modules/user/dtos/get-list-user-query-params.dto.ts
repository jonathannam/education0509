import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PagingQueryParamsDto } from 'src/app/infrastructures/dtos';

export class GetListUserQueryParamsDto extends PagingQueryParamsDto {
  @ApiProperty({ nullable: true }) readonly username?: string;
  @ApiProperty({ nullable: true })
  @Type(() => Boolean)
  readonly isActive?: boolean;
  @ApiProperty({ nullable: true })
  @IsOptional()
  readonly role?: string;
}

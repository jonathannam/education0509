import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EMPLOYEE_STATUS } from 'src/app/infrastructures/constants';
import { PagingQueryParamsDto } from 'src/app/infrastructures/dtos';

export class GetListEmployeeParamsDto extends PagingQueryParamsDto {
  @ApiProperty({ nullable: true })
  readonly name?: string;

  @ApiProperty({ nullable: true })
  readonly position?: string;

  @ApiProperty({ enum: EMPLOYEE_STATUS, nullable: true })
  @IsOptional()
  @IsEnum(EMPLOYEE_STATUS, {
    message: 'Status must be one of active, inactive, terminated',
  })
  readonly status?: EMPLOYEE_STATUS;
}

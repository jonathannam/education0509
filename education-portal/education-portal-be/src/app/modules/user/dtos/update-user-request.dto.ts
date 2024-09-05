import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty() @IsNotEmpty() readonly username: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly roleId: number;
}

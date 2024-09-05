import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty() @IsNotEmpty() readonly username: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly roleId: number;
  @ApiProperty() @IsNotEmpty() readonly password: string;
}

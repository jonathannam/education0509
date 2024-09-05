import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequestDto {
  @ApiProperty() newPassword: string;
  @ApiProperty() oldPassword: string;
}

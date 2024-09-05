import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from '../../role/dtos';

export class UserDto {
  @ApiProperty() id: number;
  @ApiProperty() username: string;
  @ApiProperty() role: RoleDto;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty() isActive: boolean;
}

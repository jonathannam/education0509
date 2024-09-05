import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionRequestDto {
  @ApiProperty() permissionIds: number[];
}

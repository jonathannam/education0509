import { ApiProperty } from '@nestjs/swagger';

export class UpsertEmployeeRequestDto {
  @ApiProperty() name: string;
  @ApiProperty() position: string;
  @ApiProperty() department: string;
  @ApiProperty() address: string;
  @ApiProperty() email: string;
  @ApiProperty() contactNumber: string;
}

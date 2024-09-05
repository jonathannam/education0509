import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() position: string;
  @ApiProperty() department: string;
  @ApiProperty() address: string;
  @ApiProperty() email: string;
  @ApiProperty() contactNumber: string;
  @ApiProperty() status: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsArray } from 'class-validator';

// DTO find User
@Exclude()
export class TotalByMonthAndStateDto {
  @ApiProperty({ description: 'Informe um documento para busca' })
  @Expose()
  @IsArray()
  @IsNotEmpty()
  months!: Array<string>;
}

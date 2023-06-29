import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsArray, MaxLength, MinLength, ArrayMaxSize } from 'class-validator';

// DTO find User
@Exclude()
export class TotalByMonthAndStateDto {
  @ApiProperty({ description: 'Informe um documento para busca' })
  @Expose()
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(3)
  months!: Array<string>;
}
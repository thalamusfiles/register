import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumberString, MaxLength, MinLength } from 'class-validator';

@Exclude()
export class LimitOffsetDto {
  @ApiProperty({ description: 'Informe o limite de resultados' })
  @Expose()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(4)
  limit!: number;

  @ApiProperty({ description: 'Informe o offset do limite de resultados' })
  @Expose()
  @IsNumberString()
  @IsNotEmpty()
  offset!: number;
}

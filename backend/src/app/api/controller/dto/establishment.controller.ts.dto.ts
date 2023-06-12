import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

@Exclude()
export class ZipcodeDto {
  @ApiProperty({ description: 'Informe um zipcode para busca' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  zipcode!: string;

  @ApiProperty({ description: 'Informe o limite de resultados' })
  @Expose()
  @IsNumberString()
  @IsNotEmpty()
  limit!: number;

  @ApiProperty({ description: 'Informe o offset do limite de resultados' })
  @Expose()
  @IsNumberString()
  @IsNotEmpty()
  offset!: number;
}

@Exclude()
export class ZipcodeRandomDto {
  @ApiProperty({ description: 'Informe o limite de resultados' })
  @Expose()
  @IsNumberString()
  @IsNotEmpty()
  limit!: number;

  @ApiProperty({ description: 'Informe o offset do limite de resultados' })
  @Expose()
  @IsNumberString()
  @IsNotEmpty()
  offset!: number;
}
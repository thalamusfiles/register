import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

@Exclude()
export class ContactDto {
  @ApiProperty({ description: 'Informe o código da cidade para busca' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  cityCode!: string;

  @ApiProperty({ description: 'Informe o tipo de negócio (CNAE)' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  businessType!: string;

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

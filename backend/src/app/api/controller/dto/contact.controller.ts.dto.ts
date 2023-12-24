import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { LimitOffsetDto } from './limitoffset.dto';

@Exclude()
export class ContactDto extends LimitOffsetDto {
  @ApiProperty({ description: 'Informe o código da cidade para busca' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  cityCode!: string;

  @ApiProperty({ description: 'Informe o tipo de negócio (CNAE)' })
  @Expose()
  @IsNotEmpty()
  @IsArray()
  businessType!: Array<string>;
}

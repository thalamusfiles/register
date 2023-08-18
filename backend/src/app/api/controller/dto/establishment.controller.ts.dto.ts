import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { LimitOffsetDto } from './limitoffset.dto';

@Exclude()
export class ZipcodeDto extends LimitOffsetDto {
  @ApiProperty({ description: 'Informe um zipcode para busca' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  zipcode!: string;
}

@Exclude()
export class BusinessTypeDto extends LimitOffsetDto {
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
}

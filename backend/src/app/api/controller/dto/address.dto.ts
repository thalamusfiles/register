import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

// DTO find User
@Exclude()
export class FindCitiesByStateDto {
  @ApiProperty({ description: 'Informe a sigla do estado' })
  @Expose()
  @IsString()
  @Length(2)
  @IsOptional()
  stateCode?: string;

  @ApiProperty({ description: 'Informe o nome da cidade' })
  @Expose()
  @IsString()
  @Length(4)
  nameLike?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

// DTO find User
@Exclude()
export class FindCnaesDto {
  @ApiProperty({ description: 'Informe a descrição ou código do cnae' })
  @Expose()
  @IsString()
  @IsOptional()
  codeOrDescriptionLike?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// DTO find User
@Exclude()
export class FindCnaesDto {
  @ApiProperty({ description: 'Informe o limite de resultados' })
  @Expose()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(4)
  limit!: number;

  @ApiProperty({ description: 'Informe a descrição ou código do cnae' })
  @Expose()
  @IsString()
  @IsOptional()
  codeOrDescriptionLike?: string;
}

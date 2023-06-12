import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

// DTO find User
@Exclude()
export class FindCitiesByStateDto {
  @ApiProperty({ description: 'Informe um documento para busca' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  stateCode!: string;
}

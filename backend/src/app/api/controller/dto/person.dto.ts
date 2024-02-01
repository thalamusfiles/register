import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

// DTO find company
@Exclude()
export class FindCompanyDto {
  @ApiProperty({ description: 'Informe um documento para busca' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  document!: string;
}

// DTO find sub
@Exclude()
export class FindSubsidiaryDto {
  @ApiProperty({ description: 'Informe um documento da matriz para busca' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  document!: string;
}

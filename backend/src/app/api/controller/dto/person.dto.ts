import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

// DTO find User
@Exclude()
export class FindCompanyDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  cnpj!: string;
}

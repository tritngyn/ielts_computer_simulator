import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class AttemptQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  testId?: string;
}

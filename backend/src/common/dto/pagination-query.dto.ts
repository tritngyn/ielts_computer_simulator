import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface CollectionResponse<T> {
  data: T[];
  pageInfo: PageInfo;
}

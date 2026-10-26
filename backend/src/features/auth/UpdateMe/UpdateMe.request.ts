import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsTimeZone,
  Max,
  Min,
} from 'class-validator';
export class UpdateMeRequest {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  dayRolloverHour?: number;
  @IsOptional()
  @IsTimeZone()
  timezone?: string;
  @IsOptional()
  @IsBoolean()
  monthlyRecap?: boolean;
}

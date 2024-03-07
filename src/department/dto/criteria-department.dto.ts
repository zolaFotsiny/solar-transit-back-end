import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CriteriaDepartmentDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    name?: string;
}
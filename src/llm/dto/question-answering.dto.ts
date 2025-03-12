import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class QuestionAnsweringDto {
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt()
  fileId: number;

  @IsString()
  @IsNotEmpty()
  prompt: string;
}

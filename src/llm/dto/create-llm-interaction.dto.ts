import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLlmInteractionDTO {
  @IsInt()
  fileId: number;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

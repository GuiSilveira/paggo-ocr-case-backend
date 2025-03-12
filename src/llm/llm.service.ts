import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLlmInteractionDTO } from './dto/create-llm-interaction.dto';
import { QuestionAnsweringDto } from './dto/question-answering.dto';

@Injectable()
export class LlmService {
  private googleGenerativeAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {
    this.googleGenerativeAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : '',
    );

    this.model = this.googleGenerativeAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction:
        'You are an assistant designed to explain or provide context for extracted text to users.',
    });
  }

  async questionAnswering({ fileId, prompt }: QuestionAnsweringDto) {
    const file = await this.fileService.findOne(fileId);

    if (!file) {
      throw new BadRequestException('File not found');
    }

    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Context: ' + file.extractedText + '\n' + prompt,
            },
          ],
        },
      ],
    });

    const responseText = result.response.text();

    const createData = {
      fileId,
      question: prompt,
      answer: responseText,
    };

    return this.create(createData);
  }

  async create(data: CreateLlmInteractionDTO) {
    return this.prisma.lLMInteraction.create({
      data,
    });
  }

  async findAllByFileId(fileId: number) {
    return this.prisma.lLMInteraction.findMany({
      where: {
        fileId,
      },
    });
  }
}

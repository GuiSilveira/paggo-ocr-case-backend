import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { QuestionAnsweringDto } from './dto/question-answering.dto';
import { LlmService } from './llm.service';

@Roles(Role.Admin, Role.User)
@UseGuards(AuthGuard, RoleGuard)
@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async questionAnswering(@Body() data: QuestionAnsweringDto) {
    return this.llmService.questionAnswering(data);
  }

  @Get('file/:fileId')
  async findAllByFileId(@Param('fileId', ParseIntPipe) fileId: number) {
    return this.llmService.findAllByFileId(fileId);
  }
}

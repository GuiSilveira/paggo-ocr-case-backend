import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync } from 'fs';
import * as PDFDocument from 'pdfkit';
import { Roles } from 'src/decorators/role.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { FileService } from './file.service';

@Roles(Role.Admin, Role.User)
@UseGuards(AuthGuard, RoleGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @User() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      await this.fileService.upload(user, file);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  async findAll(@User() user: UserPayload) {
    return this.fileService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.findOne(id);
  }

  @Delete(':id')
  async delete(
    @User() user: UserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.fileService.delete(user, id);
  }

  @Get('download/:fileId')
  async download(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Res() res: Response,
  ) {
    const file = await this.fileService.findFileWithInteractions(fileId);

    if (!file) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'File not found',
      });
    }

    if (!existsSync(file.path)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'File not found',
      });
    }

    try {
      const safeFileName = file.originalName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileName = `invoice_${safeFileName}.pdf`;

      const doc = new PDFDocument();

      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'application/pdf');

      doc.pipe(res);

      doc.image(file.path, {
        fit: [
          doc.page.width - doc.page.margins.left - doc.page.margins.right,
          doc.page.height - doc.page.margins.top - doc.page.margins.bottom,
        ],
        align: 'center',
        valign: 'center',
      });

      doc.addPage();
      doc.fontSize(14).text('=== Extracted Text ===');
      doc.moveDown();
      doc
        .fontSize(12)
        .text(file.extractedText || 'No extracted text available');
      doc.moveDown().moveDown();

      if (file.interactions && file.interactions.length > 0) {
        doc.fontSize(14).text('=== LLM Interactions ===');
        doc.moveDown();

        file.interactions.forEach((interaction, index) => {
          doc
            .fontSize(12)
            .text(`Question ${index + 1}: ${interaction.question}`);
          doc.moveDown();
          doc.fontSize(12).text(`Answer ${index + 1}: ${interaction.answer}`);
          doc.moveDown().moveDown();
        });
      }

      doc.end();
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate PDF',
      });
    }
  }
}

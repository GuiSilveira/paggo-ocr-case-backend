import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { OcrService } from 'src/ocr/ocr.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(
    private readonly ocrService: OcrService,
    private readonly prisma: PrismaService,
  ) {}

  async upload(user: User, file: Express.Multer.File) {
    const storageDir = join(__dirname, '..', '..', 'storage', 'photos');

    if (!existsSync(storageDir)) {
      await mkdir(storageDir, { recursive: true });
    }

    const fileName = `user_${user.id}_${Date.now()}_${file.originalname}`;
    const filePath = join(storageDir, fileName);

    await writeFile(filePath, file.buffer);

    const extractedText = await this.ocrService.performOcr(filePath);

    return await this.prisma.file.create({
      data: {
        userId: user.id,
        path: filePath,
        extractedText,
        fileName,
        originalName: file.originalname,
      },
    });
  }

  async findAll(user: User) {
    return await this.prisma.file.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.file.findFirst({
      where: {
        id,
      },
    });
  }

  async delete(user: User, id: number) {
    return await this.prisma.file.delete({
      where: {
        id,
        userId: user.id,
      },
    });
  }

  async findFileWithInteractions(fileId: number) {
    return await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        interactions: true,
      },
    });
  }
}

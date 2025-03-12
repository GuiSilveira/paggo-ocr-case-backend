import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { OcrModule } from 'src/ocr/ocr.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [AuthModule, UserModule, OcrModule, PrismaModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

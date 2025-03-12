import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from 'src/file/file.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';

@Module({
  imports: [PrismaModule, FileModule, AuthModule, UserModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}

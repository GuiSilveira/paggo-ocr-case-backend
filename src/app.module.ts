import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { LlmModule } from './llm/llm.module';
import { OcrModule } from './ocr/ocr.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100,
        },
      ],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    FileModule,
    OcrModule,
    LlmModule,
    // Mostrando a configuração do MailerModule com o Ethereal
    MailerModule.forRoot({
      transport: {
        host: process.env.ETHEREAL_HOST || 'smtp.ethereal.email',
        port: process.env.ETHEREAL_PORT
          ? parseInt(process.env.ETHEREAL_PORT)
          : 587,
        secure: false,
        auth: {
          user: process.env.ETHEREAL_USER,
          pass: process.env.ETHEREAL_PASSWORD,
        },
      },
      defaults: {
        from: `"Paggo Case Backend" <${process.env.ETHEREAL_USER}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

import { BadRequestException, Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService {
  async performOcr(filePath: string) {
    try {
      const worker = await createWorker(['eng', 'por']);

      const { data } = await worker.recognize(filePath);

      const { text } = data;

      await worker.terminate();

      return text;
    } catch (error: unknown) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'OCR processing failed',
      );
    }
  }
}

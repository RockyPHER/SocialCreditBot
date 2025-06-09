import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  constructor(private readonly httpService: HttpService) {}

  async reduceImage(url: string, tipo: 'emoji' | 'sticker'): Promise<Buffer> {
    const maxSize = tipo === 'emoji' ? 256 * 1024 : 512 * 1024;

    console.log('Reduzindo imagem:', { url, tipo, maxSize });

    const response = await firstValueFrom(
      this.httpService.get(url, { responseType: 'arraybuffer' }),
    );

    let buffer = Buffer.from(response.data);

    let qualidade = 90;
    let width = 128;

    while (buffer.length > maxSize && qualidade > 10) {
      buffer = await sharp(buffer)
        .resize({ width })
        .png({ quality: qualidade })
        .toBuffer();

      qualidade -= 10;
      width -= 16;
    }

    if (buffer.length > maxSize) {
      throw new Error(
        'Não foi possível reduzir a imagem abaixo do limite permitido.',
      );
    }

    return buffer;
  }
}

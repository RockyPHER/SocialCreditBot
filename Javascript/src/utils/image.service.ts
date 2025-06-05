import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async reduceImage(url: string, tipo: 'emoji' | 'sticker'): Promise<Buffer> {
    const maxSize = tipo === 'emoji' ? 256 * 1024 : 512 * 1024;

    console.log('Reduzindo imagem:', { url, tipo, maxSize });

    // Baixa a imagem da URL
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    let buffer = Buffer.from(response.data);

    let qualidade = 90;
    let width = 128;

    // Loop de tentativa até o tamanho ficar adequado
    while (buffer.length > maxSize && qualidade > 10) {
      buffer = await sharp(buffer)
        .resize({ width }) // Reduz a largura
        .png({ quality: qualidade }) // Comprime
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

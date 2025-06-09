import * as brain from 'brain.js';
import { Injectable } from '@nestjs/common';
import { sentimentdata } from './sentimentdata';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const sentimentNet = new brain.NeuralNetwork();
sentimentNet.train(sentimentdata);

@Injectable()
export class BrainJSService {
  constructor(private readonly httpService: HttpService) {}

  private toTokenObject(words: string[]) {
    const tokenized: Record<string, number> = {};
    words.forEach((word) => {
      tokenized[word] = 1;
    });
    return tokenized;
  }

  async rateSentiment(input: string): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<string[]>(
          String(process.env.API_URL),
          { text: input }, // corpo JSON
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log(response.data);

      const lemmatizedWords = response.data;

      const tokenizedInput = this.toTokenObject(lemmatizedWords);
      const output = sentimentNet.run(tokenizedInput);

      console.log(output);
      const rounded = Object.entries(output).reduce(
        (acc, [key, value]) => {
          acc[key] = Math.round(value ?? 0);
          return acc;
        },
        {} as Record<string, number>,
      );

      let sentiment: string | null = null;
      if (rounded.positivo === 1) sentiment = 'positivo';
      else if (rounded.neutro === 1) sentiment = 'neutro';
      else if (rounded.negativo === 1) sentiment = 'negativo';

      switch (sentiment) {
        case 'positivo':
          return 10;
        case 'neutro':
          return 1;
        case 'negativo':
          return -10;
        default:
          return 1;
      }
    } catch (error) {
      console.error(
        'Erro ao lematizar e classificar o sentimento:',
        error?.response?.data || error.message,
      );
      return 0;
    }
  }
}

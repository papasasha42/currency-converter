import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { CurrencyConversionService } from './currency-conversion.service';
  import { CurrencyConvertDto } from './currency-conversion.dto';
  
  @Controller({
    path: 'currencies',
    version: '1',
  })
  export class CurrencyConversionController {
    constructor(
      private readonly currencyConversionService: CurrencyConversionService,
    ) {}
  
    @Post('convert')
    @UsePipes(new ValidationPipe())
    async convert(
      @Body() convertDto: CurrencyConvertDto,
    ): Promise<{ data: { convertedAmount: number; fromCache: boolean } }> {
      const { sourceCurrency, targetCurrency, amount } = convertDto;
      const conversionResult = await this.currencyConversionService.convertAmount(
        sourceCurrency,
        targetCurrency,
        amount,
      );
  
      return {
        data: {
          convertedAmount:
            Math.round(conversionResult.data.convertedAmount * 100) / 100,
          fromCache: conversionResult.metadata.fromCache,
        },
      };
    }
  }
  
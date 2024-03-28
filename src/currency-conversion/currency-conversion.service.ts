import { Injectable } from '@nestjs/common';
import { ExchangeRateProvider } from '../common/ports/exchange-rate-provider.abstract';

@Injectable()
export class CurrencyConversionService {
  constructor(private exchangeRateProvider: ExchangeRateProvider) {}

  async convertAmount(
    sourceCurrency: string,
    targetCurrency: string,
    amount: number,
  ): Promise<{
    data: {
      convertedAmount: number;
    };
    metadata: {
      fromCache: boolean;
    };
  }> {
    const exchangeRate = await this.exchangeRateProvider.getExchangeRate(
      sourceCurrency,
      targetCurrency,
    );

    return {
      data: {
        convertedAmount: amount * exchangeRate.data.rate,
      },
      metadata: {
        fromCache: exchangeRate.metadata.fromCache,
      },
    };
  }
}

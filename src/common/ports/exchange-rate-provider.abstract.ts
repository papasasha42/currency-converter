export type ExchangeRate = {
    data: {
      rate: number;
    };
    metadata: {
      fromCache: boolean;
    };
  };
  
  export abstract class ExchangeRateProvider {
    abstract getExchangeRate(
      sourceCurrency: string,
      targetCurrency: string,
    ): Promise<ExchangeRate>;
  }
  
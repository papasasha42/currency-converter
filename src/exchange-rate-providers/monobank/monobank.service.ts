import {
    Injectable,
    Logger,
    NotFoundException,
    BadRequestException,
    ServiceUnavailableException,
    HttpException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { CacheService } from '../../common/ports/cache-service.abstract';
  import {
    ExchangeRate,
    ExchangeRateProvider,
  } from '../../common/ports/exchange-rate-provider.abstract';
  import * as currencyCodes from 'currency-codes';
  import { HttpService } from '@nestjs/axios';
  import { firstValueFrom } from 'rxjs';
  
  @Injectable()
  export class MonobankService implements ExchangeRateProvider {
    private readonly cacheTTL: number;
    private readonly logger = new Logger(MonobankService.name);
  
    constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
      private readonly cacheService: CacheService,
    ) {
      this.cacheTTL = this.configService.get<number>(
        'EXCHANGE_RATE_CACHE_TTL',
        300,
      );
    }
  
    private async fetchExchangeRates(): Promise<MonobankApiResponse> {
      const baseUrl = this.configService.get<string>('MONOBANK_API_URL');
      const response$ = this.httpService.get(`${baseUrl}/bank/currency`);
      const response = await firstValueFrom(response$);
  
      return response.data;
    }
  
    async getExchangeRate(
      sourceCurrency: string,
      targetCurrency: string,
    ): Promise<ExchangeRate> {
      try {
        const sourceCurrencyNumeric = currencyCodes.code(sourceCurrency)?.number;
        const targetCurrencyNumeric = currencyCodes.code(targetCurrency)?.number;
  
        if (!sourceCurrencyNumeric || !targetCurrencyNumeric) {
          throw new BadRequestException(
            `One of the currency codes is not valid.`,
          );
        }
  
        const cacheKey = `MONOBANK:RATES:ALL`;
        const cachedRates =
          await this.cacheService.get<MonobankApiResponse>(cacheKey);
  
        let rates: MonobankApiResponse;
  
        if (cachedRates) {
          rates = cachedRates;
        } else {
          rates = await this.fetchExchangeRates();
          await this.cacheService.set(cacheKey, rates, this.cacheTTL);
        }
        const matchingRate = rates.find(
          (rate) =>
            (rate.currencyCodeA.toString() === sourceCurrencyNumeric &&
              rate.currencyCodeB.toString() === targetCurrencyNumeric) ||
            (rate.currencyCodeA.toString() === targetCurrencyNumeric &&
              rate.currencyCodeB.toString() === sourceCurrencyNumeric),
        );
  
        if (!matchingRate) {
          throw new NotFoundException(
            `Exchange rate not found for ${sourceCurrency} to ${targetCurrency}`,
          );
        }
  
        // Determine if we should use rateBuy, rateSell, or rateCross
        let finalRate: number;
        if ('rateCross' in matchingRate) {
          finalRate = matchingRate.rateCross;
        } else if (
          matchingRate.currencyCodeA.toString() === sourceCurrencyNumeric
        ) {
          finalRate = matchingRate.rateBuy;
        } else {
          // Assuming rateSell is the inverse of rateBuy for the reverse direction
          finalRate = 1 / matchingRate.rateSell;
        }
  
        return {
          data: {
            rate: finalRate,
          },
          metadata: {
            fromCache: !!cachedRates,
          },
        };
      } catch (error) {
        console.log(error);
        if (error instanceof HttpException) {
          this.logger.warn(
            `Failed to fetch exchange rates: ${error.message || error.cause}`,
          );
          throw error;
        }
  
        this.logger.error(
          'Error fetching exchange rates:',
          error.message || error.cause,
        );
        throw new ServiceUnavailableException('Internal server error', {
          cause: error,
          description: 'Exchange rate API error',
        });
      }
    }
  }
  
  type MonobankExchangeRate = {
    currencyCodeA: number;
    currencyCodeB: number;
    date: number;
  } & (
    | {
        rateSell: number;
        rateBuy: number;
      }
    | {
        rateCross: number;
      }
  );
  
  type MonobankApiResponse = MonobankExchangeRate[];
  
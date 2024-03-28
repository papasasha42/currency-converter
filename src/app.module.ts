import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CurrencyConversionController } from './currency-conversion/currency-conversion.controller';
import { CurrencyConversionService } from './currency-conversion/currency-conversion.service';
import { ExchangeRateProviderModule } from './exchange-rate-providers/exchange-rate-provider.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // TODO: better to create a config module
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        CACHE_PROVIDER: Joi.string().valid('memory', 'redis').default('memory'),
        EXCHANGE_RATE_CACHE_TTL: Joi.number().default(300),
        MONOBANK_API_URL: Joi.string().uri().required(),
        REDIS_CONNECTION_STRING: Joi.string().uri().when('CACHE_PROVIDER', {
          is: 'redis',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),
    ExchangeRateProviderModule.register(),
  ],
  controllers: [CurrencyConversionController],
  providers: [CurrencyConversionService],
})
export class AppModule {}

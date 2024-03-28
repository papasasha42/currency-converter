import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyConversionController } from './currency-conversion.controller';
import { CurrencyConversionService } from './currency-conversion.service';
import { CurrencyConvertDto } from './currency-conversion.dto';
import { ExchangeRateProvider } from '../common/ports/exchange-rate-provider.abstract';

describe('CurrencyConversionController', () => {
  let controller: CurrencyConversionController;
  let exchangeRateProviderMock: jest.Mocked<ExchangeRateProvider>;

  beforeEach(async () => {
    exchangeRateProviderMock = {
      getExchangeRate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyConversionController],
      providers: [
        CurrencyConversionService,
        {
          provide: ExchangeRateProvider,
          useValue: exchangeRateProviderMock,
        },
      ],
    }).compile();

    controller = module.get<CurrencyConversionController>(
      CurrencyConversionController,
    );
  });

  describe('successful conversion', () => {
    it('should convert currency and return the converted amount', async () => {
      exchangeRateProviderMock.getExchangeRate.mockResolvedValue({
        data: {
          rate: 40,
        },
        metadata: {
          fromCache: false,
        },
      });

      const convertDto: CurrencyConvertDto = {
        amount: 100,
        sourceCurrency: 'USD',
        targetCurrency: 'UAH',
      };

      const expectedResult = {
        data: {
          convertedAmount: 4000,
          fromCache: false,
        },
      };

      const result = await controller.convert(convertDto);

      expect(result).toEqual(expectedResult);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('/v1/currencies/convert (POST)', () => {
  let app: INestApplication;

  const configServiceMock = {
    get(key: string) {
      const config = {
        CACHE_PROVIDER: 'memory',
        MONOBANK_API_URL: 'http://api.mock',
      };
      return config[key as keyof typeof config] || null;
    },
  };

  beforeAll(async () => {
    const hostname = '127.0.0.1';
    nock.disableNetConnect();
    nock.enableNetConnect(hostname);

    nock.emitter.on('no match', (req) => {
      if (req.hostname !== hostname) {
        throw new Error(
          `Unexpected request to: ${req.hostname} ${req.path} has been blocked`,
        );
      }
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    nock('http://api.mock')
      .get('/bank/currency')
      .reply(200, [
        {
          currencyCodeA: 840,
          currencyCodeB: 980,
          date: 1234567890,
          rateBuy: 40,
          rateSell: 40,
        },
      ]);
  });

  afterAll(async () => {
    await app.close();
    nock.enableNetConnect();
  });

  it('responds as expected to correct payload', async () => {
    await request(app.getHttpServer())
      .post('/currencies/convert')
      .send({
        sourceCurrency: 'USD',
        targetCurrency: 'UAH',
        amount: 100,
      })
      .expect(201)
      .expect({
        data: {
          convertedAmount: 4000,
          fromCache: false,
        },
      });
  });

  it('responds with 400 to invalid payload', async () => {
    await request(app.getHttpServer())
      .post('/currencies/convert')
      .send({
        sourceCurrency: 'USD',
        targetCurrency: 'UA',
        amount: 100,
      })
      .expect(400)
      .expect({
        message: ['targetCurrency must be a valid ISO4217 currency code'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('responds with 404 to unsupported currency pair', async () => {
    await request(app.getHttpServer())
      .post('/currencies/convert')
      .send({
        sourceCurrency: 'USD',
        targetCurrency: 'RUB',
        amount: 100,
      })
      .expect(404)
      .expect({
        message: 'Exchange rate not found for USD to RUB',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('responds with 500 if Monobank API is down', async () => {
    nock.cleanAll();
    nock('http://api.mock').get('/bank/currency').reply(500);

    await request(app.getHttpServer())
      .post('/currencies/convert')
      .send({
        sourceCurrency: 'USD',
        targetCurrency: 'UAH',
        amount: 100,
      })
      .expect(503)
      .expect({
        message: 'Internal server error',
        error: 'Exchange rate API error',
        statusCode: 503,
      });
  });
});

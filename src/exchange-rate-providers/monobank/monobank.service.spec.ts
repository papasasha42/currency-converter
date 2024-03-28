import { MonobankService } from './monobank.service';
import { of } from 'rxjs';

describe('MonobankService', () => {
  let monobankService: MonobankService;

  beforeEach(async () => {
    monobankService = new MonobankService(
      {
        get: jest.fn().mockReturnValue(of({ data: ratesMock })),
      } as any,
      {
        get: jest.fn().mockReturnValue('https://api.mock'),
      } as any,
      {
        get: jest.fn().mockReturnValue(null),
        set: jest.fn(),
      } as any,
    );
  });

  it('should be defined', () => {
    expect(monobankService).toBeDefined();
  });

  it('should fetch exchange rates', async () => {
    const fetchSpy = jest.spyOn(monobankService['httpService'], 'get');

    await monobankService.getExchangeRate('USD', 'UAH');

    expect(fetchSpy).toHaveBeenCalledWith('https://api.mock/bank/currency');
  });

  it('should use cache if exists', async () => {
    const cacheGetSpy = jest
      .spyOn(monobankService['cacheService'], 'get')
      .mockResolvedValue(ratesMock);

    await monobankService.getExchangeRate('USD', 'UAH');

    expect(cacheGetSpy).toHaveBeenCalledWith('MONOBANK:RATES:ALL');
  });

  it('should set cache if not exists', async () => {
    const cacheSetSpy = jest.spyOn(monobankService['cacheService'], 'set');

    await monobankService.getExchangeRate('USD', 'UAH');

    expect(cacheSetSpy).toHaveBeenCalledWith(
      'MONOBANK:RATES:ALL',
      ratesMock,
      monobankService['cacheTTL'],
    );
  });

  it('should throw if one of the currency codes is not valid', async () => {
    await expect(
      monobankService.getExchangeRate('USD', 'NOT_VALID'),
    ).rejects.toThrow();
  });

  it('should throw if exchange rate not found', async () => {
    await expect(
      monobankService.getExchangeRate('USD', 'RUB'),
    ).rejects.toThrow();
  });
});

const ratesMock = [
  {
    currencyCodeA: 840,
    currencyCodeB: 980,
    date: 1711231273,
    rateBuy: 38.92,
    rateSell: 39.3499,
  },
  {
    currencyCodeA: 978,
    currencyCodeB: 980,
    date: 1711231273,
    rateBuy: 42.1,
    rateSell: 42.8009,
  },
  {
    currencyCodeA: 978,
    currencyCodeB: 840,
    date: 1711231273,
    rateBuy: 1.077,
    rateSell: 1.09,
  },
  {
    currencyCodeA: 826,
    currencyCodeB: 980,
    date: 1711316804,
    rateCross: 49.914,
  },
  {
    currencyCodeA: 392,
    currencyCodeB: 980,
    date: 1711316541,
    rateCross: 0.2606,
  },
  {
    currencyCodeA: 756,
    currencyCodeB: 980,
    date: 1711316812,
    rateCross: 43.9113,
  },
  {
    currencyCodeA: 156,
    currencyCodeB: 980,
    date: 1711316847,
    rateCross: 5.4572,
  },
  {
    currencyCodeA: 784,
    currencyCodeB: 980,
    date: 1711316807,
    rateCross: 10.7197,
  },
  {
    currencyCodeA: 971,
    currencyCodeB: 980,
    date: 1703852583,
    rateCross: 0.5417,
  },
  {
    currencyCodeA: 8,
    currencyCodeB: 980,
    date: 1711316348,
    rateCross: 0.4143,
  },
  {
    currencyCodeA: 51,
    currencyCodeB: 980,
    date: 1711315439,
    rateCross: 0.0991,
  },
  {
    currencyCodeA: 973,
    currencyCodeB: 980,
    date: 1711215163,
    rateCross: 0.0472,
  },
  {
    currencyCodeA: 32,
    currencyCodeB: 980,
    date: 1711316775,
    rateCross: 0.0407,
  },
  {
    currencyCodeA: 36,
    currencyCodeB: 980,
    date: 1711315785,
    rateCross: 25.8976,
  },
  {
    currencyCodeA: 944,
    currencyCodeB: 980,
    date: 1711316747,
    rateCross: 23.216,
  },
  {
    currencyCodeA: 50,
    currencyCodeB: 980,
    date: 1711290145,
    rateCross: 0.3584,
  },
  {
    currencyCodeA: 975,
    currencyCodeB: 980,
    date: 1711316811,
    rateCross: 21.8465,
  },
  {
    currencyCodeA: 48,
    currencyCodeB: 980,
    date: 1711312337,
    rateCross: 104.6172,
  },
  {
    currencyCodeA: 108,
    currencyCodeB: 980,
    date: 1703366443,
    rateCross: 0.0133,
  },
  {
    currencyCodeA: 96,
    currencyCodeB: 980,
    date: 1711261063,
    rateCross: 29.3074,
  },
  {
    currencyCodeA: 68,
    currencyCodeB: 980,
    date: 1711313347,
    rateCross: 5.7345,
  },
  {
    currencyCodeA: 986,
    currencyCodeB: 980,
    date: 1711316365,
    rateCross: 7.9183,
  },
  {
    currencyCodeA: 72,
    currencyCodeB: 980,
    date: 1706718696,
    rateCross: 2.8013,
  },
  {
    currencyCodeA: 933,
    currencyCodeB: 980,
    date: 1711303259,
    rateCross: 12.1243,
  },
  {
    currencyCodeA: 124,
    currencyCodeB: 980,
    date: 1711316852,
    rateCross: 29.1169,
  },
  {
    currencyCodeA: 976,
    currencyCodeB: 980,
    date: 1709384289,
    rateCross: 0.0141,
  },
  {
    currencyCodeA: 152,
    currencyCodeB: 980,
    date: 1711316791,
    rateCross: 0.04,
  },
  {
    currencyCodeA: 170,
    currencyCodeB: 980,
    date: 1711316846,
    rateCross: 0.0101,
  },
  {
    currencyCodeA: 188,
    currencyCodeB: 980,
    date: 1711316504,
    rateCross: 0.0775,
  },
  {
    currencyCodeA: 192,
    currencyCodeB: 980,
    date: 1687102850,
    rateCross: 1.5599,
  },
  {
    currencyCodeA: 203,
    currencyCodeB: 980,
    date: 1711316817,
    rateCross: 1.6932,
  },
  {
    currencyCodeA: 262,
    currencyCodeB: 980,
    date: 1709811261,
    rateCross: 0.2165,
  },
  {
    currencyCodeA: 208,
    currencyCodeB: 980,
    date: 1711316597,
    rateCross: 5.7396,
  },
  {
    currencyCodeA: 12,
    currencyCodeB: 980,
    date: 1711316543,
    rateCross: 0.2922,
  },
  {
    currencyCodeA: 818,
    currencyCodeB: 980,
    date: 1711316751,
    rateCross: 0.8447,
  },
  {
    currencyCodeA: 230,
    currencyCodeB: 980,
    date: 1711290686,
    rateCross: 0.6937,
  },
  {
    currencyCodeA: 981,
    currencyCodeB: 980,
    date: 1711316800,
    rateCross: 14.7194,
  },
  {
    currencyCodeA: 936,
    currencyCodeB: 980,
    date: 1711229999,
    rateCross: 3.0195,
  },
  {
    currencyCodeA: 270,
    currencyCodeB: 980,
    date: 1711132800,
    rateCross: 0.613,
  },
  {
    currencyCodeA: 324,
    currencyCodeB: 980,
    date: 1711121512,
    rateCross: 0.0046,
  },
  {
    currencyCodeA: 344,
    currencyCodeB: 980,
    date: 1711313934,
    rateCross: 5.0338,
  },
  {
    currencyCodeA: 191,
    currencyCodeB: 980,
    date: 1680625280,
    rateCross: 5.4258,
  },
  {
    currencyCodeA: 348,
    currencyCodeB: 980,
    date: 1711316837,
    rateCross: 0.1086,
  },
  {
    currencyCodeA: 360,
    currencyCodeB: 980,
    date: 1711316241,
    rateCross: 0.0025,
  },
  {
    currencyCodeA: 376,
    currencyCodeB: 980,
    date: 1711316070,
    rateCross: 10.9385,
  },
  {
    currencyCodeA: 356,
    currencyCodeB: 980,
    date: 1711316451,
    rateCross: 0.4712,
  },
  {
    currencyCodeA: 368,
    currencyCodeB: 980,
    date: 1711314217,
    rateCross: 0.03,
  },
  {
    currencyCodeA: 352,
    currencyCodeB: 980,
    date: 1711313967,
    rateCross: 0.2861,
  },
  {
    currencyCodeA: 400,
    currencyCodeB: 980,
    date: 1711308836,
    rateCross: 55.5683,
  },
  {
    currencyCodeA: 404,
    currencyCodeB: 980,
    date: 1711313949,
    rateCross: 0.2971,
  },
  {
    currencyCodeA: 417,
    currencyCodeB: 980,
    date: 1711314287,
    rateCross: 0.4396,
  },
  {
    currencyCodeA: 116,
    currencyCodeB: 980,
    date: 1711284048,
    rateCross: 0.0097,
  },
  {
    currencyCodeA: 410,
    currencyCodeB: 980,
    date: 1711308164,
    rateCross: 0.0295,
  },
  {
    currencyCodeA: 414,
    currencyCodeB: 980,
    date: 1711308087,
    rateCross: 128.0576,
  },
  {
    currencyCodeA: 398,
    currencyCodeB: 980,
    date: 1711316626,
    rateCross: 0.0873,
  },
  {
    currencyCodeA: 418,
    currencyCodeB: 980,
    date: 1711285472,
    rateCross: 0.0018,
  },
  {
    currencyCodeA: 422,
    currencyCodeB: 980,
    date: 1711128900,
    rateCross: 0.0004,
  },
  {
    currencyCodeA: 144,
    currencyCodeB: 980,
    date: 1711308805,
    rateCross: 0.1298,
  },
  {
    currencyCodeA: 434,
    currencyCodeB: 980,
    date: 1710088604,
    rateCross: 8.0008,
  },
  {
    currencyCodeA: 504,
    currencyCodeB: 980,
    date: 1711316272,
    rateCross: 3.9017,
  },
  {
    currencyCodeA: 498,
    currencyCodeB: 980,
    date: 1711316750,
    rateCross: 2.2307,
  },
  {
    currencyCodeA: 969,
    currencyCodeB: 980,
    date: 1711278218,
    rateCross: 0.0089,
  },
  {
    currencyCodeA: 807,
    currencyCodeB: 980,
    date: 1711315733,
    rateCross: 0.6926,
  },
  {
    currencyCodeA: 496,
    currencyCodeB: 980,
    date: 1711255610,
    rateCross: 0.0115,
  },
  {
    currencyCodeA: 480,
    currencyCodeB: 980,
    date: 1711291230,
    rateCross: 0.8521,
  },
  {
    currencyCodeA: 454,
    currencyCodeB: 980,
    date: 1678369785,
    rateCross: 0.0368,
  },
  {
    currencyCodeA: 484,
    currencyCodeB: 980,
    date: 1711316725,
    rateCross: 2.3545,
  },
  {
    currencyCodeA: 458,
    currencyCodeB: 980,
    date: 1711315881,
    rateCross: 8.3345,
  },
  {
    currencyCodeA: 943,
    currencyCodeB: 980,
    date: 1710589406,
    rateCross: 0.6148,
  },
  {
    currencyCodeA: 516,
    currencyCodeB: 980,
    date: 1711273000,
    rateCross: 2.0958,
  },
  {
    currencyCodeA: 566,
    currencyCodeB: 980,
    date: 1711280325,
    rateCross: 0.0276,
  },
  {
    currencyCodeA: 558,
    currencyCodeB: 980,
    date: 1711227039,
    rateCross: 1.0765,
  },
  {
    currencyCodeA: 578,
    currencyCodeB: 980,
    date: 1711316322,
    rateCross: 3.6993,
  },
  {
    currencyCodeA: 524,
    currencyCodeB: 980,
    date: 1711289491,
    rateCross: 0.2955,
  },
  {
    currencyCodeA: 554,
    currencyCodeB: 980,
    date: 1711316586,
    rateCross: 23.818,
  },
  {
    currencyCodeA: 512,
    currencyCodeB: 980,
    date: 1711300519,
    rateCross: 102.2721,
  },
  {
    currencyCodeA: 604,
    currencyCodeB: 980,
    date: 1711316595,
    rateCross: 10.715,
  },
  {
    currencyCodeA: 608,
    currencyCodeB: 980,
    date: 1711314637,
    rateCross: 0.7023,
  },
  {
    currencyCodeA: 586,
    currencyCodeB: 980,
    date: 1711309656,
    rateCross: 0.1414,
  },
  {
    currencyCodeA: 985,
    currencyCodeB: 980,
    date: 1711316856,
    rateCross: 9.9312,
  },
  {
    currencyCodeA: 600,
    currencyCodeB: 980,
    date: 1711305569,
    rateCross: 0.0053,
  },
  {
    currencyCodeA: 634,
    currencyCodeB: 980,
    date: 1711316173,
    rateCross: 10.8157,
  },
  {
    currencyCodeA: 946,
    currencyCodeB: 980,
    date: 1711316837,
    rateCross: 8.6126,
  },
  {
    currencyCodeA: 941,
    currencyCodeB: 980,
    date: 1711316717,
    rateCross: 0.3634,
  },
  {
    currencyCodeA: 682,
    currencyCodeB: 980,
    date: 1711316758,
    rateCross: 10.485,
  },
  {
    currencyCodeA: 690,
    currencyCodeB: 980,
    date: 1711293628,
    rateCross: 2.8028,
  },
  {
    currencyCodeA: 938,
    currencyCodeB: 980,
    date: 1680961561,
    rateCross: 0.0627,
  },
  {
    currencyCodeA: 752,
    currencyCodeB: 980,
    date: 1711316683,
    rateCross: 3.7637,
  },
  {
    currencyCodeA: 702,
    currencyCodeB: 980,
    date: 1711313055,
    rateCross: 29.3053,
  },
  {
    currencyCodeA: 694,
    currencyCodeB: 980,
    date: 1664217991,
    rateCross: 0.0024,
  },
  {
    currencyCodeA: 706,
    currencyCodeB: 980,
    date: 1683386099,
    rateCross: 0.0659,
  },
  {
    currencyCodeA: 968,
    currencyCodeB: 980,
    date: 1709335105,
    rateCross: 1.0848,
  },
  {
    currencyCodeA: 748,
    currencyCodeB: 980,
    date: 1706459505,
    rateCross: 2.0391,
  },
  {
    currencyCodeA: 764,
    currencyCodeB: 980,
    date: 1711316460,
    rateCross: 1.0854,
  },
  {
    currencyCodeA: 972,
    currencyCodeB: 980,
    date: 1711298631,
    rateCross: 3.5888,
  },
  {
    currencyCodeA: 788,
    currencyCodeB: 980,
    date: 1711275627,
    rateCross: 12.6451,
  },
  {
    currencyCodeA: 949,
    currencyCodeB: 980,
    date: 1711316824,
    rateCross: 1.2452,
  },
  {
    currencyCodeA: 901,
    currencyCodeB: 980,
    date: 1711300954,
    rateCross: 1.2329,
  },
  {
    currencyCodeA: 834,
    currencyCodeB: 980,
    date: 1711294537,
    rateCross: 0.0154,
  },
  {
    currencyCodeA: 800,
    currencyCodeB: 980,
    date: 1711304440,
    rateCross: 0.0101,
  },
  {
    currencyCodeA: 858,
    currencyCodeB: 980,
    date: 1711297704,
    rateCross: 1.0438,
  },
  {
    currencyCodeA: 860,
    currencyCodeB: 980,
    date: 1711316203,
    rateCross: 0.0031,
  },
  {
    currencyCodeA: 704,
    currencyCodeB: 980,
    date: 1711315361,
    rateCross: 0.0015,
  },
  {
    currencyCodeA: 950,
    currencyCodeB: 980,
    date: 1711262750,
    rateCross: 0.0652,
  },
  {
    currencyCodeA: 952,
    currencyCodeB: 980,
    date: 1711312059,
    rateCross: 0.0652,
  },
  {
    currencyCodeA: 886,
    currencyCodeB: 980,
    date: 1702176265,
    rateCross: 0.1496,
  },
  {
    currencyCodeA: 710,
    currencyCodeB: 980,
    date: 1711313831,
    rateCross: 2.0945,
  },
];

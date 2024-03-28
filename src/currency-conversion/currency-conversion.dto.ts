import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsISO4217CurrencyCode,
    IsPositive,
    Max,
  } from 'class-validator';
  
  export class CurrencyConvertDto {
    @IsNotEmpty()
    @IsString()
    @IsISO4217CurrencyCode()
    sourceCurrency: string;
  
    @IsNotEmpty()
    @IsString()
    @IsISO4217CurrencyCode()
    targetCurrency: string;
  
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Max(1_000_000)
    amount: number;
  }
  

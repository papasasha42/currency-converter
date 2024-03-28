import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsISO4217CurrencyCode,
    IsPositive,
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
    amount: number;
  }
  
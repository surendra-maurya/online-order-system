import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrency',
  standalone: true
})
export class AppCurrencyPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currencySymbol: string = '$',
    decimals: number = 2
  ): string {
    if (value === null || value === undefined) return `${currencySymbol}0.00`;
    return `${currencySymbol}${value.toFixed(decimals)}`;
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starRating',
  standalone: true
})
export class StarRatingPipe implements PipeTransform {
  transform(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      '★'.repeat(fullStars) +
      (hasHalf ? '½' : '') +
      '☆'.repeat(emptyStars)
    );
  }
}
import { Pipe, PipeTransform } from '@angular/core';
import { Entry } from '../models/entry.model';

@Pipe({
  name: 'nostalgia',
  standalone: true
})
export class NostalgiaPipe implements PipeTransform {
  transform(entries: Entry[], showNostalgia: boolean = false): Entry[] {
    if (!showNostalgia || !entries) {
      return entries;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    return entries.filter(entry => {
      const entryDate = new Date(entry.event_date);
      const entryMonth = entryDate.getMonth();
      const entryDay = entryDate.getDate();
      const entryYear = entryDate.getFullYear();
      const currentYear = today.getFullYear();

      // Show entries from same month/day but different year (past)
      return entryMonth === currentMonth && 
             entryDay === currentDay && 
             entryYear < currentYear;
    });
  }
}

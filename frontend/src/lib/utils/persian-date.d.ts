declare module 'persian-date' {
  class PersianDate {
    constructor(date?: any);
    format(pattern: string): string;
    add(unit: string, value: number): PersianDate;
    subtract(unit: string, value: number): PersianDate;
    parse(dateStr: string): PersianDate;
    toDate(): Date;
    year(): number;
    month(): number;
    day(): number;
  }
  
  export = PersianDate;
}

export function nameTime (hour: number): string {
  if (hour >= 6 && hour <= 18) {
     return 'Day'
  }
  return 'Night'
}

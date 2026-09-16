import moment from 'moment/min/moment-with-locales'

export const dateFormat = (date: string | Date): string => {
  return moment(date).locale('th').format('LL')
}

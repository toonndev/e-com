import numeral from 'numeral'

export const numberFormat = (num: number): string => {
  return numeral(num).format('0,0')
}

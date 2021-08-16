/**
 * Converts the given date string in the format
 * `YYYY-MM-DD` and time `HH:mm:ss` to a Date object.
 */
export const toDateFromLocalISO = (dateString: string, timeString: string) => {
  const [year, month, date] = dateString.split('-')
  const [hours, minutes] = timeString.split(':')

  return new Date(+year, +month - 1, +date, +hours, +minutes)
}

/**
 * Returns the components of a given date in ISO format.
 *
 * @param {Date} date The date to get the components of.
 */
export const getDateComponents = (date: Date) => {
  const year = date.getFullYear()
  const month = padNumber(date.getMonth() + 1)
  const dayOfMonth = padNumber(date.getDate())
  const hours = padNumber(date.getHours())
  const minutes = padNumber(date.getMinutes())
  const seconds = padNumber(date.getSeconds())

  return { year, month, date: dayOfMonth, hours, minutes, seconds }
}

/**
 * Returns the string representation of a number
 * with a leading zero if it is less than 10.
 *
 * @param {number} number The number to format.
 */
export const padNumber = (number: number) => {
  return `${number}`.length === 1 ? `0${number}` : number
}

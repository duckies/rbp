export const isString = (fn: any): fn is string => typeof fn === 'string';

/**
 * An asynchronous sleep function for a non-blocking pause.
 */
export const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Determines if an object has no properties.
 * @param o Object
 */
export const isEmpty = (o: Record<string, unknown>) =>
  Object.keys(o).length === 0;

/**
 * Replaces variables in a string template.
 *
 * @param str String template.
 * @param data Object representing the properties to replace in the string.
 */
export const template = (str: string, data: Record<string, string | number>) =>
  str.replace(/{(\w*)}/g, (_, token: string) => <string>data[token]);

/**
 * Returns the previous occurance of a specific day of the week
 * closest to the date provided. This is inclusive.
 *
 * @param day Day of the week to find the last occurance of.
 */
export const getLastWeekday = (
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
) => {
  const d = new Date();

  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 7 - day) % 7));
  d.setUTCHours(hours);
  d.setUTCMinutes(minutes);
  d.setUTCSeconds(seconds);
  d.setUTCMilliseconds(milliseconds);

  return d;
};

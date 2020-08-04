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

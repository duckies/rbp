export const isUnset = (o: unknown): boolean => typeof o === 'undefined' || o === null

export const isSet = (o: unknown): boolean => !isUnset(o)

export const encodeValue = (val: unknown): string => {
  if (typeof val === 'string') {
    return val
  }
  return JSON.stringify(val)
}

export const decodeValue = (val: unknown): object | undefined | unknown => {
  // If value is an object, return object
  if (typeof val === 'object') {
    return val
  }

  // If value is somehow undefined, return as is (erroneous code)
  if (typeof val === 'undefined') {
    return val
  }

  // Finally try to parse it as json, or fallback to original value
  try {
    return JSON.parse(val as string)
  } catch (error) {
    return val
  }
}

export const encodeQuery = (queryObject: object): string => {
  return Object.entries(queryObject)
    .filter(tuple => typeof Object.values(tuple)[0] !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
}

export const getDisplayableAmountFromMinUnit = (bi, decimals, desired) => {
  const trunc = decimals - desired
  const shift = decimals - trunc
  const str = (bi.divide(10 ** trunc).toJSNumber() / 10 ** shift).toFixed(desired)
  return parseFloat(str)
}

export const toFixed = (bi, decimals, desired) => {
  const trunc = decimals - desired
  const shift = decimals - trunc
  return (bi.divide(10 ** trunc).toJSNumber() / 10 ** shift).toFixed(desired)
}

export const getRoundedWei = (rawValue, decimals = 18) => {
  const value = rawValue ? parseFloat(rawValue) / 10 ** decimals : 0
  return Math.floor(value * 10) / 10
}

export const abbreviateAddress = (address) => {
  return address && address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
}

export const titleCheck = (title) => {
  if (title == null || title === 'undefined') {
    return 'No Title'
  } else {
    return title
  }
}

export const pluralCheck = (count) => {
  if (count === 1) {
    return ''
  } else {
    return 's'
  }
}

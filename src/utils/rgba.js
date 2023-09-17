const {RGBA_REGEX} = require('../constants/regex')

const {between} = require('./math')

const isRgbaShortString = rgbaString => RGBA_REGEX.SHORT.test(rgbaString)

const isRgbaLongString = rgbaString => RGBA_REGEX.LONG.test(rgbaString)

/**
 * Accepts a string like this 'rgba(N, N, N, A)' or 'N, N, N, A'
 */
const isRgbaString = rgbaString => {
  const isShort = isRgbaShortString(rgbaString)
  const isLong = isRgbaLongString(rgbaString)

  if (!isShort && !isLong) return false
  return true
}

/**
 * Accepts a string like this 'rgba(N, N, N, A)' or 'N, N, N, A' with N numeric values between 0 and 255, A numeric values between 0 and 1
 */
const isRgba = rgba => {
  if (!isRgbaString(rgba)) return false

  const isShort = isRgbaShortString(rgba)
  const isValid = value => typeof value === 'number' && between(value, [0, 255])
  const isValidAlpha = value => typeof value === 'number' && between(value, [0, 1])
  const rgbaArr = isShort ? rgbaShortStringFormat(rgba) : rgbaLongStringFormat(rgba)

  const alpha = rgbaArr.splice(-1, 1)[0]
  return rgbaArr.every(isValid) && isValidAlpha(alpha)
}

/**
 * Convert 'rgba(N, N, N, A)' to [N, N, N, A]
 */
const rgbaLongStringFormat = rgbaString => {
  return rgbaString
    .replace('rgba', '')
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map(n => Number(n.trim()))
}

/**
 * Convert 'N, N, N, A' to [N, N, N, A]
 */
const rgbaShortStringFormat = rgbaString => {
  return rgbaString.split(',').map(n => Number(n.trim()))
}

module.exports = {
  isRgbaShortString,
  isRgbaLongString,
  isRgbaString,
  isRgba,
  rgbaLongStringFormat,
  rgbaShortStringFormat,
}

const {RGB_REGEX} = require('../constants/regex')

const {between} = require('./math')

const isRgbShortString = rgbString => RGB_REGEX.SHORT.test(rgbString)

const isRgbLongString = rgbString => RGB_REGEX.LONG.test(rgbString)

/**
 * Accepts a string like this 'rgb(N, N, N)' or 'N, N, N'
 */
const isRgbString = rgbString => {
  const isShort = isRgbShortString(rgbString)
  const isLong = isRgbLongString(rgbString)

  if (!isShort && !isLong) return false
  return true
}

/**
 * Accepts a string like this 'rgb(N, N, N)' or 'N, N, N' with N numeric values between 0 and 255
 */
const isRgb = rgb => {
  if (!isRgbString(rgb)) return false

  const isShort = isRgbShortString(rgb)
  const rgbArr = isShort ? rgbShortStringFormat(rgb) : rgbLongStringFormat(rgb)
  const isValid = value => typeof value === 'number' && between(value, [0, 255])

  return rgbArr.every(isValid)
}

/**
 * Convert 'rgb(N, N, N)' to [N, N, N]
 */
const rgbLongStringFormat = rgbString => {
  return rgbString
    .replace('rgb', '')
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map(n => Number(n.trim()))
}

/**
 * Convert 'N, N, N' to [N, N, N]
 */
const rgbShortStringFormat = rgbString => {
  return rgbString.split(',').map(n => Number(n.trim()))
}

module.exports = {
  isRgbShortString,
  isRgbLongString,
  isRgb,
  rgbLongStringFormat,
  rgbShortStringFormat,
}

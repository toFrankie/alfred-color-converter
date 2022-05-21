import { HEX_COLOR_REGEX, RGBA_COLOR_REGEX, RGB_COLOR_REGEX } from '../constants/regex'
import { isRgbShortString, isRgbLongString } from './rgb-utils'
import { isRgbaLongString, isRgbaShortString } from './rgba-utils'

export const getHexColorString = string => {
  HEX_COLOR_REGEX.lastIndex = 0
  const matches = HEX_COLOR_REGEX.exec(string)
  return matches ? matches[0] : ''
}

export const getRgbColorString = string => {
  RGB_COLOR_REGEX.lastIndex = 0
  const matches = RGB_COLOR_REGEX.exec(string)
  if (matches) return matches[0]

  if (isRgbLongString(string) || isRgbShortString(string)) return string
  return ''
}

export const getRgbaColorString = string => {
  RGBA_COLOR_REGEX.lastIndex = 0
  const matches = RGBA_COLOR_REGEX.exec(string)
  if (matches) return matches[0]

  if (isRgbaLongString(string) || isRgbaShortString(string)) return string
  return ''
}

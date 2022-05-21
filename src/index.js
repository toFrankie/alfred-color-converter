import path from 'path'
import alfy from 'alfy'
import convert from 'color-convert'
import namedColor from './constants/color-name'
import { dirname } from './utils/path-utils'
import { COLOR_TYPE } from './constants/color'
import { getHexColorString, getRgbColorString, getRgbaColorString } from './utils/color-utils'
import { isRgbShortString, rgbShortStringFormat, rgbLongStringFormat } from './utils/rgb-utils'
import { isRgbaShortString, rgbaShortStringFormat, rgbaLongStringFormat } from './utils/rgba-utils'

const __dirname = dirname(import.meta)

const parseColors = inputString => {
  let str = String(inputString).trim()
  const colorList = []
  let hasNext = false

  // css named color, see: https://drafts.csswg.org/css-color/#named-colors
  const namedColorRgb = namedColor[str]
  if (namedColorRgb) {
    colorList.push({ label: COLOR_TYPE.RGB, value: namedColorRgb, rawStr: str })
    colorList.push({ label: COLOR_TYPE.HEX, value: convert.rgb.hex(namedColorRgb), rawStr: str })
    return colorList
  }

  do {
    hasNext = false

    // hex color
    const hexColor = getHexColorString(str)
    if (hexColor) {
      colorList.push({ label: COLOR_TYPE.HEX, value: hexColor })
      hasNext = true
    }
    str = str.replace(hexColor, '')

    // rgb color
    const rgbColor = getRgbColorString(str)
    if (rgbColor) {
      let formatedColor = ''
      if (isRgbShortString(rgbColor)) {
        formatedColor = rgbShortStringFormat(rgbColor)
      } else {
        formatedColor = rgbLongStringFormat(rgbColor)
      }

      colorList.push({ label: COLOR_TYPE.RGB, value: formatedColor })
      hasNext = true
    }
    str = str.replace(rgbColor, '')

    // rgba color
    const rgbaColor = getRgbaColorString(str)
    if (rgbaColor) {
      let formatedColor = ''
      if (isRgbaShortString(rgbaColor)) {
        formatedColor = rgbaShortStringFormat(rgbaColor)
      } else {
        formatedColor = rgbaLongStringFormat(rgbaColor)
      }

      colorList.push({ label: COLOR_TYPE.RGBA, value: formatedColor })
      hasNext = true
    }
    str = str.replace(rgbaColor, '')
  } while (hasNext && str)

  return colorList
}

const colorConvert = ({ label, value, rawStr }) => {
  const { HEX, RGB, RGBA } = COLOR_TYPE
  const result = { label, from: value, to: value }

  switch (label) {
    case HEX: {
      // missing hex alpha
      if (value.length === 5) value = value.substring(0, 4)
      if (value.length === 9) value = value.substring(0, 7)

      const converted = convert.hex.rgb(value)
      result.from = rawStr || value.toLowerCase()
      result.to = `rgb(${converted.join(', ')})`
      break
    }
    case RGB:
    case RGBA: {
      // missing rgba alpha
      value.length = 3

      const converted = convert.rgb.hex(value)
      result.from = rawStr || `rgb(${value.join(', ')})`
      result.to = `#${converted}`.toLowerCase()
      break
    }
  }

  return result
}

try {
  const input = alfy.input
  const colorList = parseColors(input)

  const alfredList = colorList.map(colorInfo => {
    const { label, from, to } = colorConvert(colorInfo)
    const iconPath = path.resolve(
      __dirname,
      'asserts',
      `${label === COLOR_TYPE.HEX ? 'HEX' : 'RGB'}.png`
    )

    return {
      arg: to,
      title: to,
      subtitle: `Press enter copy to clipboard. ${from} 👉 ${to}`,
      icon: { path: iconPath },
    }
  })

  if (alfredList.length === 0) throw new Error('Invalid color')

  alfy.output(alfredList)
} catch (e) {
  alfy.output([
    {
      title: `Not a valid color`,
      subtitle: 'please re-check your input.',
      arg: 'convert failed',
    },
  ])
}

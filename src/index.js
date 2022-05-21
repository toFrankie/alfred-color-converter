import alfy from 'alfy'
import convert from 'color-convert'
import { COLOR_TYPE } from './constants/color'
import { getHexColorString, getRgbColorString, getRgbaColorString } from './utils/color-utils'
import { isRgbShortString, rgbShortStringFormat, rgbLongStringFormat } from './utils/rgb-utils'
import { isRgbaShortString, rgbaShortStringFormat, rgbaLongStringFormat } from './utils/rgba-utils'

const getColorsByInput = inputString => {
  let str = String(inputString).trim()
  const colorList = []
  let hasNext = false

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

const colorConvert = (label, value) => {
  const { HEX, RGB, RGBA } = COLOR_TYPE
  const result = { label, from: value, to: value }

  switch (label) {
    case HEX: {
      // missing hex alpha
      if (value.length === 5) value = value.substring(0, 4)
      if (value.length === 9) value = value.substring(0, 7)

      const converted = convert.hex.rgb(value)
      result.from = value.toLowerCase()
      result.to = `rgb(${converted.join(', ')})`
      break
    }
    case RGB:
    case RGBA: {
      // missing rgba alpha
      value.length = 3

      const converted = convert.rgb.hex(value)
      result.from = `rgb(${value.join(', ')})`
      result.to = `#${converted}`.toLowerCase()
      break
    }
  }

  return result
}

try {
  const input = alfy.input
  const colorList = getColorsByInput(input)
  const alfredList = colorList.map(({ label, value }) => {
    const { from, to } = colorConvert(label, value)
    return {
      arg: to,
      title: to,
      subtitle: `Press enter to copy to clipboard. ${from} 👉 ${to}`,
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

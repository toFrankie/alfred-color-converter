import alfy from 'alfy'
import convert from 'color-convert'
import { COLOR_TYPE } from './constants/color'
import { rgbStringToObject, rgbaStringToObject, rgbToHex, rgbaToHex } from 'colors-convert'
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

  switch (label) {
    case HEX: {
      const rgbArr = convert.hex.rgb(value)
      return `rgb(${rgbArr.join(', ')})`
    }
    case RGB: {
      const rgbString = `rgb(${value[0]}, ${value[1]}, ${value[2]})`
      const rgbObject = rgbStringToObject(rgbString)
      return rgbToHex(rgbObject).toLowerCase()
    }
    case RGBA: {
      const rgbaString = `rgba(${value[0]}, ${value[1]}, ${value[2]}, ${value[3]})`
      const rgbaObject = rgbaStringToObject(rgbaString)
      return rgbaToHex(rgbaObject).toLowerCase()
    }
    default:
      return value
  }
}

try {
  const input = alfy.input
  const colorList = getColorsByInput(input)
  const alfredList = colorList.map(({ label, value }) => {
    const converted = colorConvert(label, value)
    return {
      arg: converted,
      title: converted,
      subtitle: 'Press enter to copy to clipboard.',
    }
  })

  if (alfredList.length === 0) throw new Error('Invalid color')

  alfy.output(alfredList)
} catch (e) {
  alfy.output([
    {
      title: 'Invalid color',
      subtitle: e.message,
      arg: 'convert failed',
    },
  ])
}

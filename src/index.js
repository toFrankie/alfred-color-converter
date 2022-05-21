import alfy from 'alfy'
import hexColorRegex from 'hex-color-regex'
import rgbRegex from 'rgb-regex'
import rgbaRegex from 'rgba-regex'
import convert from 'color-convert'
import {
  rgbStringToObject,
  rgbaStringToObject,
  isRgbString,
  isRgbaString,
  rgbToHex,
  rgbaToHex,
} from 'colors-convert'

const COLOR_TYPE = {
  HEX: 'hex',
  RGB: 'rgb',
  RGBA: 'rgba',
}

const getColor = input => {
  input = String(input).trim()

  // hex color
  const hexColor = hexColorRegex().exec(input)
  if (hexColor) return { label: COLOR_TYPE.HEX, value: hexColor[0] } // match[1] without the hash

  // rgb color
  const rgbColor = rgbRegex().exec(input)
  if (rgbColor) return { label: COLOR_TYPE.RGB, value: rgbColor[0] }

  // rgba color
  const rgbaColor = rgbaRegex().exec(input)
  if (rgbaColor) return { label: COLOR_TYPE.RGBA, value: rgbaColor[0] }

  // short rgb color: 255, 0, 255
  if (isRgbString(input)) return { label: COLOR_TYPE.RGB, value: input }

  // short rgba color: 255, 0, 255, 0.5
  if (isRgbaString(input)) return { label: COLOR_TYPE.RGBA, value: input }

  return { label: null, value: null }
}

const colorConvert = (label, value) => {
  const { HEX, RGB, RGBA } = COLOR_TYPE

  switch (label) {
    case HEX: {
      const rgbArr = convert.hex.rgb(value)
      return `rgb(${rgbArr.join(', ')})`
    }
    case RGB: {
      const rgbObject = rgbStringToObject(value)
      return rgbToHex(rgbObject).toLowerCase()
    }
    case RGBA: {
      const rgbaObject = rgbaStringToObject(value)
      return rgbaToHex(rgbaObject).toLowerCase()
    }
    default:
      return value
  }
}

try {
  const input = alfy.input
  const { label: colorLabel, value: colorValue } = getColor(input)
  const converted = colorConvert(colorLabel, colorValue)
  if (!converted) throw new Error('Invalid color') // 目前仅支持 hex、rgb、rgba

  alfy.output([
    {
      title: converted,
      subtitle: 'Press enter to copy to clipboard.',
      arg: converted,
    },
  ])
} catch (e) {
  alfy.output([
    {
      title: 'Invalid color',
      subtitle: e.message,
      arg: 'convert failed',
    },
  ])
}

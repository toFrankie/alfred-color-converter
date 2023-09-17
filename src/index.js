const convert = require('color-convert')

const namedColor = require('./constants/color-name')
const {COLOR_TYPE} = require('./constants/color')
const {getHexColorString, getRgbColorString, getRgbaColorString} = require('./utils/color')
const {isRgbShortString, rgbShortStringFormat, rgbLongStringFormat} = require('./utils/rgb')
const {isRgbaShortString, rgbaShortStringFormat, rgbaLongStringFormat} = require('./utils/rgba')

const parseColors = inputString => {
  let str = String(inputString).trim()
  const colorList = []
  let hasNext = false

  // css named color, see: https://drafts.csswg.org/css-color/#named-colors
  const namedColorRgb = namedColor[str]
  if (namedColorRgb) {
    colorList.push({type: COLOR_TYPE.RGB, value: namedColorRgb, rawStr: str})
    colorList.push({type: COLOR_TYPE.HEX, value: convert.rgb.hex(namedColorRgb), rawStr: str})
    return colorList
  }

  do {
    hasNext = false

    // hex color
    const hexColor = getHexColorString(str)
    if (hexColor) {
      colorList.push({type: COLOR_TYPE.HEX, value: hexColor})
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

      colorList.push({type: COLOR_TYPE.RGB, value: formatedColor})
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

      colorList.push({type: COLOR_TYPE.RGBA, value: formatedColor})
      hasNext = true
    }
    str = str.replace(rgbaColor, '')
  } while (hasNext && str)

  return colorList
}

const colorConvert = ({type, value, rawStr}) => {
  const {HEX, RGB, RGBA} = COLOR_TYPE
  const result = {type, from: value, to: value}

  let newValue = value
  switch (type) {
    case HEX: {
      // missing hex alpha
      if (newValue.length === 5) newValue = newValue.substring(0, 4)
      if (newValue.length === 9) newValue = newValue.substring(0, 7)

      const converted = convert.hex.rgb(newValue)
      result.from = rawStr || newValue.toLowerCase()
      result.to = `rgb(${converted.join(', ')})`
      break
    }
    case RGB:
    case RGBA: {
      // missing rgba alpha
      newValue.length = 3

      const converted = convert.rgb.hex(newValue)
      result.from = rawStr || `rgb(${newValue.join(', ')})`
      result.to = `#${converted}`.toLowerCase()
      break
    }
    default:
      break
  }

  return result
}

try {
  const [_exec, _script, input = ''] = process.argv.map(arg => arg.trim())
  const colorList = parseColors(input)

  const alfredList = colorList.map(colorInfo => {
    const {type, from, to} = colorConvert(colorInfo)
    const iconPath = `./${type === COLOR_TYPE.HEX ? 'hex' : 'rgb'}.png`

    return {
      arg: to,
      title: to,
      subtitle: `Press enter copy to clipboard. ${from} 👉 ${to}`,
      icon: {path: iconPath},
    }
  })

  if (alfredList.length === 0) throw new Error('Invalid color')

  console.log(JSON.stringify({items: alfredList}))
} catch (e) {
  const invalidItem = {
    title: `Not a valid color`,
    subtitle: 'please re-check your input.',
    arg: 'convert failed',
  }
  console.log(JSON.stringify({items: [invalidItem]}))
}

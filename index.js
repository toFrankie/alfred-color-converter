import alfy from "alfy";
import hexColorRegex from "hex-color-regex";
import rgbRegex from "rgb-regex";
import rgbaRegex from "rgba-regex";
import {
  hexToRgbOrRgba,
  rgbStringToObject,
  rgbaStringToObject,
  isRgbString,
  isRgbaString,
  rgbToHex,
  rgbaToHex,
} from "colors-convert";

const COLOR_TYPE = {
  HEX: "hex",
  RGB: "rgb",
  RGBA: "rgba",
};

const getColor = (input) => {
  input = String(input).trim();

  // hex color
  const hexColor = hexColorRegex().exec(input);
  if (hexColor) return { type: COLOR_TYPE.HEX, value: hexColor[0] }; // match[1] without the hash

  // rgb color
  const rgbColor = rgbRegex().exec(input);
  if (rgbColor) return { type: COLOR_TYPE.RGB, value: rgbColor[0] };

  // rgba color
  const rgbaColor = rgbaRegex().exec(input);
  if (rgbaColor) return { type: COLOR_TYPE.RGBA, value: rgbaColor[0] };

  // short rgb color: 255, 0, 255
  if (isRgbString(input)) return { type: COLOR_TYPE.RGB, value: input };

  // short rgba color: 255, 0, 255, 0.5
  if (isRgbaString(input)) return { type: COLOR_TYPE.RGBA, value: input };

  return { type: null, value: null };
};

const colorConvert = (type, value) => {
  const { HEX, RGB, RGBA } = COLOR_TYPE;

  switch (type) {
    case HEX:
      return rgbOrRgbaFormat(hexToRgbOrRgba(value));
    case RGB: {
      const rgbObject = rgbStringToObject(value);
      return rgbToHex(rgbObject).toLowerCase();
      // TODO: toShort
    }
    case RGBA: {
      const rgbaObject = rgbaStringToObject(value);
      return rgbaToHex(rgbaObject).toLowerCase();
      // TODO: toShort
    }
    default:
      return value;
  }
};

const rgbOrRgbaFormat = (colorObj) => {
  const { r, g, b, a } = colorObj;
  return a !== undefined
    ? `rgba(${r}, ${g}, ${b}, ${a})`
    : `rgb(${r}, ${g}, ${b})`;
};

try {
  const input = alfy.input;
  const { type: colorType, value: colorValue } = getColor(input);
  const converted = colorConvert(colorType, colorValue);
  if (!converted) throw new Error("Invalid color"); // 目前仅支持 hex、rgb、rgba

  alfy.output([
    {
      title: converted,
      subtitle: `convert '${input}' to '${converted}'`,
      arg: converted,
    },
  ]);
} catch (e) {
  alfy.output([
    {
      title: "Invalid color",
      subtitle: e.message,
      arg: "convert failed",
    },
  ]);
}

export const HEX_COLOR_REGEX = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi

export const RGB_COLOR_REGEX = /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/gi

export const RGBA_COLOR_REGEX =
  /rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*(?:\.\d+)?)\s*\)/gi

// Accept: 'rgb(N, N, N)' or 'N, N, N'
export const RGB_REGEX = {
  SHORT: /^(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*)$/i,
  LONG: /^(rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\))$/i,
}

// Accept: 'rgba(N, N, N, A)' or 'N, N, N, A'
export const RGBA_REGEX = {
  SHORT: /^(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*(?:\.\d+)?)\s*)$/i,
  LONG: /^(rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*(?:\.\d+)?)\s*\))$/i,
}

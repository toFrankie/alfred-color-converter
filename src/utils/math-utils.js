export const between = (value, range) => {
  const min = Math.min.apply(null, range)
  const max = Math.max.apply(null, range)
  return value >= min && value <= max
}

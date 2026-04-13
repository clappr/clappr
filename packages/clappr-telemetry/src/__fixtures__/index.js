export const makeBuffered = (ranges) => ({
  length: ranges.length,
  start: (i) => ranges[i][0],
  end: (i) => ranges[i][1]
})

export function formatDuration(time: number) {
  const convert = (num: Number) => num > 9 ? `${num}:` : (num > 0 ? `0${num}:` : '')
  const convertMin = (num: Number) => num > 9 ? `${num}:` : (num > 0 ? `0${num}:` : '00:')
  const convertSec = (num: Number) => num > 9 ? `${num}` : (num > 0 ? `0${num}` : '00')
  const hour = Math.floor(time / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = (time % 3600) % 60

  return hour === 0 && min === 0 ? `00:${convertSec(sec)}` : convert(hour) + convertMin(min) + convertSec(sec)
}
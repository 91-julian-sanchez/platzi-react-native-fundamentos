export const startOfDay = (date: Date) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  return currentDate
}
export const isSameDay = (firstDate: Date, secondaDate: Date) => 
  startOfDay(firstDate).getTime() === startOfDay(secondaDate).getTime()

export const isYesterday = (ref: Date, candidate: Date) => {
  const y = startOfDay(ref)
  y.setDate(y.getDate() - 1)
  return isSameDay(y, candidate)
}

export const toISO = (date: Date) => startOfDay(date).toISOString()
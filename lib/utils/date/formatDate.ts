export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(timeString: string): string {
  return timeString
}

export function formatDateTime(dateString: string, timeString: string): string {
  const date = new Date(dateString)
  const time = timeString
  return `${formatDate(dateString)} lúc ${time}`
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`
}
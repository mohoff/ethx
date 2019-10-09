import { formatDistanceToNow } from 'date-fns'

export const getTime = (blockTimestampInSeconds: number): string => {
  const isoDate = new Date(blockTimestampInSeconds * 1000).toISOString()
  const timePassed = formatDistanceToNow(blockTimestampInSeconds * 1000, {
    includeSeconds: true,
    addSuffix: true,
  })

  return `${isoDate} (${timePassed})`
}

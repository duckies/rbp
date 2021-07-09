import { Region } from '@server/blizzard/enums/region.enum'

export const Regions = Object.freeze<{ label: string; value: Region }>([
  { label: 'US', value: Region.US },
  { label: 'EU', value: Region.EU },
  { label: 'KR', value: Region.KR },
  { label: 'TW', value: Region.TW },
  { label: 'CN', value: Region.CN },
])

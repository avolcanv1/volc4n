import { DvdFloater } from './DvdFloater'
import { useIdle } from '../hooks/useIdle'
import { ID_CARD_IDLE_MS, ID_CARD_IMAGE } from '../lib/idCard'

export function IdleIdCard() {
  const isIdle = useIdle(ID_CARD_IDLE_MS)

  return <DvdFloater active={isIdle} src={ID_CARD_IMAGE} />
}

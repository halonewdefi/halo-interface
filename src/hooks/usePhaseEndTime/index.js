import { useQuery } from 'react-query'
import { getEndTime as getPhase1EndTime } from '../../common/phase1'
import { getEndTime as getPhase2EndTime } from '../../common/phase2'
import { defaults } from '../../common'
import { usePhase } from '..'
import { phase2 } from '../../artifacts'

export const usePhaseEndTime = (
	type,
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const phase = usePhase()

	const t = useQuery(`${phase?.address}_endTime`,
		async () => {
			if (phase?.which === 1) {
				return await getPhase1EndTime()
			}
			if (phase2.which === 2) {
				return await getPhase2EndTime()
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
			enabled: !!phase,
		},
	)

	if (t.data) {
		if (type === 'isEnded') {
			const n = new Date()
			const eT = new Date(t.data * 1000)
			return eT < n
		}
		return t
	}

}
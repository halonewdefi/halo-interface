import { useQuery } from 'react-query'
import { getEndTime as getPhase1EndTime } from '../../common/phase1'
import { getEndTime as getPhase2EndTime } from '../../common/phase2'
import { defaults } from '../../common'
import { usePhase } from '..'
import { BigNumber } from 'ethers'

export const usePhaseEndTime = (
	type,
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const phase = usePhase()

	if (phase.which > 0) {
		const t = useQuery(`${phase?.address}_endTime`,
			async () => {
				if (phase?.which === 1) {
					return await getPhase1EndTime()
				}
				if (phase.which === 2) {
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
	else {
		return {
			data: BigNumber.from(2067007803),
			isSuccess: true,
		}
	}

}
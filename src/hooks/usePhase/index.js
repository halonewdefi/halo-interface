import { useQuery } from 'react-query'
import { getEndTime as getPhase1EndTime } from '../../common/phase1'
import { getEndTime as getPhase2EndTime } from '../../common/phase2'
import { defaults } from '../../common'

export const usePhase = (
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const n = new Date()

	const p1 = useQuery(`${defaults.address.phase1}_endTime`,
		async () => {
			if (defaults.address.phase1) {
				return await getPhase1EndTime()
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
		},
	)

	const p2 = useQuery(`${defaults.address.phase2}_endTime`,
		async () => {
			if (defaults.address.phase2) {
				return await getPhase2EndTime()
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
		},
	)

	if (p1.data) {
		if (new Date(p1.data * 1000) > n) {
			return {
				which: 1,
				address: defaults.address.phase1,
			}
		}
		else if (p2.data) {
			if (new Date(p2.data * 1000) > n) {
				return {
					which: 2,
					address: defaults.address.phase2,
				}
			}
			else {
				return {
					which: 3,
					address: '0x0',
				}
			}
		}
	}
	else {
		return 0
	}
}
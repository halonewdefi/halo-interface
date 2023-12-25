import { useQuery } from 'react-query'
import { getEndTime as getPhase1EndTime } from '../../common/phase1'
import { getEndTime as getPhase2EndTime, getStartTime } from '../../common/phase2'
import { defaults } from '../../common'

export const usePhase = (
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const n = new Date()

	// const p1endTime = useQuery(`${defaults.address.phase1}_endTime`,
	// 	async () => {
	// 		return await getPhase1EndTime()
	// 	}, {
	// 		staleTime: staleTime,
	// 		refetchInterval: refetchInterval,
	//		enabled: !!defaults.address.phase1,
	// 	},
	// )

	// const p2startTime = useQuery(`${defaults.address.phase2}_startTime`,
	// 	async () => {
	// 		return await getStartTime()
	// 	}, {
	// 		staleTime: staleTime,
	// 		refetchInterval: refetchInterval,
	//		enabled: !!defaults.address.phase2,
	// 	},
	// )

	// const p3startTime = useQuery(`${defaults.address.phase3}_startTime`,
	// 	async () => {
	// 		return await getPhase3StartTime()
	// 	}, {
	// 		staleTime: staleTime,
	// 		refetchInterval: refetchInterval,
	//		enabled: !!defaults.address.phase3,
	// 	},
	// )

	const p0endTime = {
		data: 1703610488,
	}
	const p1startTime = {
		data: 2067007803,
	}
	const p2startTime = {
		data: 2367007803,
	}

	if (p0endTime.data) {
		if (new Date(p0endTime.data * 1000) >= n) {
			return {
				which: 0,
				address: defaults.address.phase0,
			}
		}
		else if (p1startTime.data) {
			if (new Date(p1startTime * 1000) >= n) {
				return {
					which: 1,
					address: defaults.address.phase1,
				}
			}
			else if (p2startTime.data) {
				if (new Date(p2startTime.data * 1000) >= n) {
					return {
						which: 2,
						address: defaults.address.phase2,
					}
				}
				else {
					return 0
				}
			}
		}
	}
	else {
		return 0
	}
}
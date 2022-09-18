import { useQuery } from 'react-query'
import { getEndTime } from '../../common/phase1'
import { defaults } from '../../common'

export const usePhase1endTime = (
	type,
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const t = useQuery(`${defaults.address.phase1}_endTime`,
		async () => {
			if (defaults.address.phase1) {
				return await getEndTime()
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
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
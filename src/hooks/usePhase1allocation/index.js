import { useQuery } from 'react-query'
import { getAllocation } from '../../common/phase1'
import { defaults } from '../../common'

export const usePhase1allocation = (
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const allocation = useQuery(`${defaults.address.phase1}_HALO_PER_PAIR`,
		async () => {
			if (defaults.address.phase1) {
				return await getAllocation()
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
		},
	)

	return allocation
}
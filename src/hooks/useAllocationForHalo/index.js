import { useQuery } from 'react-query'
import { getAllocationForHalo } from '../../common'
import { defaults } from '../../common'

export const useAllocationForHalo = (
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const allocation = useQuery(`${defaults.address.phase2}_ALLOCATION_FOR_Halo`,
		async () => {
			return await getAllocationForHalo()
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
			enabled: !!defaults.address.phase2,
		},
	)

	return allocation
}
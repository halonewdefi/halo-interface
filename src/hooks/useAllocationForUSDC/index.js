import { useQuery } from 'react-query'
import { getAllocationForUSDC } from '../../common'
import { defaults } from '../../common'

export const useAllocationForUSDC = (
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const allocation = useQuery(`${defaults.address.phase2}_ALLOCATION_FOR_USDC`,
		async () => {
			return await getAllocationForUSDC()
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
			enabled: !!defaults.address.phase2,
		},
	)

	return allocation
}
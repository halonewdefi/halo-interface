import { useQuery } from 'react-query'
import { getPositions } from '../../common/phase2'
import { defaults } from '../../common'
import { useWallet } from 'use-wallet'

export const usePhase2Position = (
	pair,
	address = undefined,
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const wallet = useWallet()

	const position = useQuery(`${pair.token0}_phase2_positionof_${address ? address : wallet.account}`,
		async () => {
			if (pair.token0) {
				return await getPositions(
					pair.token0,
					address ? address : wallet.account,
				)
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
			enabled: (address || !!wallet.account) && !!pair.token0,
		},
	)

	return position
}
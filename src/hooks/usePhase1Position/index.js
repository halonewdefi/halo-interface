import { useQuery } from 'react-query'
import { getPositions } from '../../common'
import { defaults } from '../../common'
import { useWallet } from 'use-wallet'

export const usePhase1Position = (
	pair,
	address = undefined,
	staleTime = defaults.api.staleTime,
	refetchInterval = false,
) => {

	const wallet = useWallet()

	const position = useQuery(`${pair}_positionof_${address ? address : wallet.account}`,
		async () => {
			if ((address || wallet?.account) &&
				pair) {
				return await getPositions(
					pair,
					address ? address : wallet.account,
				)
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
			enabled: (address || !!wallet.account) && !!pair,
		},
	)

	return position
}
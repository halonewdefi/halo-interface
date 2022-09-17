import { useQuery } from 'react-query'
import { quoteHalo } from '../../common/phase1'
import { defaults } from '../../common'
import { useWallet } from 'use-wallet'

export const useQuoteHalo = (
	pair,
	address,
	staleTime = defaults.api.staleTime, refetchInterval = defaults.api.refetchInterval) => {

	const wallet = useWallet()

	const quote = useQuery(`${pair}_quoteHaloof_${address ? address : wallet?.account}`,
		async () => {
			if ((address || wallet?.account) &&
			pair) {
				return await quoteHalo(
					pair,
					address ? address : wallet?.account,
					defaults.network.provider,
				)
			}
		}, {
			refetchInterval: refetchInterval,
			staleTime: staleTime,
			enabled: ((address || !!wallet?.account) && !!pair),
		},
	)

	return quote
}
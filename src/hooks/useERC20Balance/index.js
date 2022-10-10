import { useQuery } from 'react-query'
import { getERC20BalanceOf } from '../../common/erc20utils'
import { defaults } from '../../common'
import { useWallet } from 'use-wallet'

export const useERC20Balance = (
	tokenAddress,
	address,
	staleTime = defaults.api.staleTime,
	refetchInterval = defaults.api.refetchInterval,
) => {

	const wallet = useWallet()

	const balance = useQuery(`${tokenAddress}_erc20Balanceof_${address ? address : wallet?.account}`,
		async () => {
			if ((address || wallet?.account) &&
				tokenAddress) {
				return await getERC20BalanceOf(
					tokenAddress,
					address ? address : wallet?.account,
					defaults.network.provider,
				)
			}
		}, {
			refetchInterval: refetchInterval,
			staleTime: staleTime,
			enabled: ((address || !!wallet?.account) && !!tokenAddress),
		},
	)

	return balance
}
import { useQuery } from 'react-query'
import { getERC20Allowance } from '../../common/erc20utils'
import { defaults } from '../../common'
import { useWallet } from 'use-wallet'

export const useERC20Allowance = (tokenAddress, spenderAddress, ownerAddress, staleTime = defaults.api.staleTime) => {

	const wallet = useWallet()

	const allowance = useQuery(`${tokenAddress}_erc20Allowance_${ownerAddress ? ownerAddress : wallet?.account}_for_${spenderAddress}`,
		async () => {
			if ((ownerAddress || wallet?.account) &&
				tokenAddress) {
				return await getERC20Allowance(
					tokenAddress,
					spenderAddress,
					ownerAddress ? ownerAddress : wallet?.account,
				)
			}
		}, {
			staleTime: staleTime,
			enabled: ((ownerAddress || !!wallet?.account) && !!tokenAddress && !!spenderAddress),
		},
	)

	return allowance
}
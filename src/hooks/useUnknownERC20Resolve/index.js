import { useQuery } from 'react-query'
import { resolveUnknownERC20 } from '../../common/erc20utils'
import { defaults } from '../../common'

export const useUnknownERC20Resolve = (tokenAddress, staleTime = defaults.api.staleTime) => {

	const token = useQuery(`${tokenAddress}_ERC20Resolved`,
		async () => {
			if (tokenAddress) {
				return await resolveUnknownERC20(tokenAddress)
			}
		}, {
			staleTime: staleTime,
			enabled: !!tokenAddress,
		},
	)

	return token
}
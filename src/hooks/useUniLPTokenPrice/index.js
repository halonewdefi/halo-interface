import { useQuery } from 'react-query'
import { getERC20TotalSupply } from '../../common/erc20utils'
import { getToken0, getToken1 } from '../../common/uniswapV2Pair'
import { defaults } from '../../common'

export const useUniLPTokenPrice = (pairAddress, staleTime = defaults.api.staleTime) => {

	const { data: token0 } = useQuery(`${pairAddress}_token0`,
		async () => {

			if (pairAddress) {
				return await getToken0(
					pairAddress,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	const { data: token1 } = useQuery(`${pairAddress}_token1`,
		async () => {

			if (pairAddress) {
				return await getToken1(
					pairAddress,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	const { data: totalSupply } = useQuery(`${pairAddress}_totalSupply`,
		async () => {

			if (pairAddress) {
				return await getERC20TotalSupply(
					pairAddress,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	return totalSupply
}
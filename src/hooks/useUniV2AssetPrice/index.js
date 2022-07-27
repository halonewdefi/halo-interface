import { useQuery } from 'react-query'
import { getToken0, getToken1 } from '../../common/uniswapV2Pair'
import { defaults, getERC20Decimals } from '../../common'
import { useERC20Balance } from '../useERC20Balance'
import { BigNumber, utils } from 'ethers'
import { useEffect, useState } from 'react'

export const useUniV2AssetPrice = (pairAddress, swapTokens = false, staleTime = defaults.api.staleTime) => {

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

	const { data: token0decimals } = useQuery(`${token0}_decimals`,
		async () => {

			if (token0) {
				return await getERC20Decimals(
					token0,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!token0,
		},
	)

	const { data: token1decimals } = useQuery(`${token1}_decimals`,
		async () => {

			if (token1) {
				return await getERC20Decimals(
					token1,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!token1,
		},
	)

	const [price, setPrice] = useState(BigNumber.from(0))
	const token0balance = useERC20Balance(token0, pairAddress)
	const token1balance = useERC20Balance(token1, pairAddress)

	useEffect(() => {
		if (token0balance?.data &&
			token1balance?.data &&
			token0decimals &&
			token0decimals) {
			if (!swapTokens) {
				setPrice((utils.formatUnits(token1balance?.data, token1decimals)) / (utils.formatUnits(token0balance?.data, token0decimals)))
			}
			else {
				setPrice((utils.formatUnits(token0balance?.data, token0decimals)) / (utils.formatUnits(token1balance?.data, token1decimals)))
			}
		}
	}, [token0balance?.data,
		token1balance?.data,
		token0decimals,
		token1decimals,
		swapTokens])

	return [price, token0balance, token1balance]
}
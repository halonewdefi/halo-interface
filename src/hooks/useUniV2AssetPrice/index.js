import { useQuery } from 'react-query'
import { getToken0, getToken1 } from '../../common/uniswapV2Pair'
import { defaults, getERC20Decimals } from '../../common'
import { useERC20Balance } from '../useERC20Balance'
import { BigNumber, utils } from 'ethers'
import { useEffect, useState } from 'react'

export const useUniV2AssetPrice = (pairAddress, swapTokens = false, staleTime = defaults.api.staleTime) => {

	const { data: token0, refetch: token0Refetch } = useQuery(`${pairAddress}_token0`,
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

	const { data: token1, refetch: token1Refetch } = useQuery(`${pairAddress}_token1`,
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

	const { data: token0Decimals, refetch: token0DecimalsRefetch } = useQuery(`${token0}_decimals`,
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

	const { data: token1Decimals, refetch: token1DecimalsRefetch } = useQuery(`${token1}_decimals`,
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
	const token0Balance = useERC20Balance(token0, pairAddress)
	const token1Balance = useERC20Balance(token1, pairAddress)

	const refetchAll = () => {
		token0Refetch()
		token1Refetch()
		token0DecimalsRefetch()
		token1DecimalsRefetch()
		token0Balance.refetch()
		token1Balance.refetch()
	}

	useEffect(() => {
		if (token0Balance?.data &&
			token1Balance?.data &&
			token0Decimals &&
			token0Decimals) {
			if (!swapTokens) {
				setPrice((utils.formatUnits(token1Balance?.data, token1Decimals)) / (utils.formatUnits(token0Balance?.data, token0Decimals)))
			}
			else {
				setPrice((utils.formatUnits(token0Balance?.data, token0Decimals)) / (utils.formatUnits(token1Balance?.data, token1Decimals)))
			}
		}
	}, [
		token0Balance?.data,
		token1Balance?.data,
		token0Decimals,
		token1Decimals,
		swapTokens,
	])

	return {
		price: price,
		token0Balance: token0Balance,
		token1Balance: token1Balance,
		refetchAll: refetchAll,
	}
}
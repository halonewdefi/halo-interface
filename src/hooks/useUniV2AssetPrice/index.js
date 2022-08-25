import { useQuery } from 'react-query'
import { getToken0, getToken1 } from '../../common/uniswapV2Pair'
import { defaults, getERC20Decimals } from '../../common'
import { useERC20Balance } from '../useERC20Balance'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'

export const useUniV2AssetPrice = (pairAddress, swapTokens = false, staleTime = defaults.api.staleTime, refetchInterval = defaults.api.refetchInterval) => {

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

	const [price, setPrice] = useState(0)
	const [token0Price, setToken0Price] = useState(0)
	const [token1Price, setToken1Price] = useState(0)
	const token0Balance = useERC20Balance(token0, pairAddress, refetchInterval)
	const token1Balance = useERC20Balance(token1, pairAddress, refetchInterval)

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
			const a = Number(((utils.formatUnits(token1Balance?.data, token1Decimals)) / (utils.formatUnits(token0Balance?.data, token0Decimals))).toFixed(token1Decimals))
			const b = Number(((utils.formatUnits(token0Balance?.data, token0Decimals)) / (utils.formatUnits(token1Balance?.data, token1Decimals))).toFixed(token0Decimals))
			setToken0Price(a)
			setToken1Price(b)
			if (!swapTokens) {
				setPrice(a)
			}
			else {
				setPrice(b)
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
		token0Price: token0Price,
		token1Price: token1Price,
		token0Balance: token0Balance,
		token1Balance: token1Balance,
		refetchAll: refetchAll,
	}
}
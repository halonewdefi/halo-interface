import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { defaults, getERC20TotalSupply } from '../../common'
import { getToken0, getToken1 } from '../../common/uniswapV2Pair'
import { ethers } from 'ethers'
import { useERC20Balance } from '../useERC20Balance'
import { usePhase1Position } from '../usePhase1Position'

export const useUniV2Liquidity = (
	pairAddress,
	staleTime = defaults.api.staleTime,
	refetchInterval = defaults.api.refetchInterval,
) => {

	const { data: totalSupply, refetch: totalSupplyRefetch, isLoading: totalSupplyIsLoading } = useQuery(`${pairAddress}_totalSupply`,
		async () => {
			if (pairAddress) {
				return await getERC20TotalSupply(
					pairAddress,
				)
			}

		}, {
			refetchInterval: refetchInterval,
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	const { data: token0, isLoading: token0IsLoading } = useQuery(`${pairAddress}_token0`,
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

	const { data: token1, isLoading: token1IsLoading } = useQuery(`${pairAddress}_token1`,
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

	const phase1position = usePhase1Position(pairAddress)
	const balance0 = useERC20Balance(token0, pairAddress)
	const balance1 = useERC20Balance(token1, pairAddress)
	const [amount0, setAmount0] = useState(ethers.BigNumber.from('0'))
	const [amount1, setAmount1] = useState(ethers.BigNumber.from('0'))

	const refetchAll = () => {
		phase1position.refetch()
		balance0.refetch()
		balance1.refetch()
		totalSupplyRefetch()
	}

	useEffect(() => {
		if (phase1position.data &&
				totalSupply &&
				balance0.data &&
				balance1.data) {
			try {
				setAmount0(
					phase1position.data[2].mul(balance0.data).div(totalSupply),
				)
				setAmount1(
					phase1position.data[2].mul(balance1.data).div(totalSupply),
				)
			}
			catch (error) {
				console.log(error)
			}
		}
	}, [
		totalSupply,
		balance0.data,
		balance1.data,
	])

	return {
		token0: amount0,
		token1: amount1,
		isLoading: (
			totalSupplyIsLoading ||
			token0IsLoading ||
			token1IsLoading ||
			phase1position.isLoading ||
			balance0.isLoading
		),
		refetch: refetchAll,
	}
}
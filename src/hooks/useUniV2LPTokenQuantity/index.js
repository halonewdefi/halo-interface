import { useQuery } from 'react-query'
import { defaults, getERC20TotalSupply, getReserves } from '../../common'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export const useUniV2LPTokenQuantity = (
	pairAddress,
	token0Amount = ethers.BigNumber.from(0),
	token1Amount = ethers.BigNumber.from(0),
	staleTime = defaults.api.staleTime,
	refetchInterval = defaults.api.refetchInterval,
) => {

	const { data: totalSupply, refetch: totalSupplyRefetch } = useQuery(`${pairAddress}_totalSupply`,
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

	const { data: reserves, refetch: reservesRefetch } = useQuery(`${pairAddress}_reserves`,
		async () => {

			if (pairAddress) {
				return await getReserves(
					pairAddress,
				)
			}

		}, {
			refetchInterval: refetchInterval,
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	const [quantity, setQuantity] = useState(ethers.BigNumber.from(0))

	const refetchAll = () => {
		totalSupplyRefetch()
		reservesRefetch()
	}

	useEffect(() => {
		if (totalSupply &&
			reserves &&
			token0Amount &&
			token1Amount) {
			try {
				const q = Math.min(
					token0Amount.mul(totalSupply) / reserves?.[0],
					token1Amount.mul(totalSupply) / reserves?.[1],
				)
				if (q) {
					setQuantity(q)
				}
				else {
					setQuantity(0)
				}
			}
			catch (error) {
				console.log(error)
			}
		}
	}, [
		totalSupply,
		reserves,
		token0Amount,
		token1Amount,
	])

	return {
		lpTokenQuantity: quantity,
		totalSupply: totalSupply,
		reserves: reserves,
		refetchAll: refetchAll,
	}
}
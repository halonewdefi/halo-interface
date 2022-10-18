import { useQuery } from 'react-query'
import { defaults, getTotalWeightOfLockedPositions, getPositions } from '../../common'
import { usePhase1allocation } from '../usePhase1allocation'
import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { BigNumber, ethers } from 'ethers'

export const usePreQuoteHalo = (
	positionAmount,
	positionMultiplier,
	pair,
	subtract,
	address = undefined,
	staleTime = defaults.api.staleTime,
	refetchInterval = defaults.api.refetchInterval,
) => {

	const wallet = useWallet()

	const { data: allocation } = usePhase1allocation()

	const { data: totalWeightOfLockedPositions,
		refetch: refetchTotalWeightOfLockedPositions,
	 } = useQuery(`${pair}_totalWeightOfLockedPositions`,
		async () => {
			if (defaults.address.phase1) {
				return await getTotalWeightOfLockedPositions(pair)
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
			enabled: !!pair,
		},
	)

	const { data: position,
		refetch: refetchPosition,
	} = useQuery(`${pair}_positionof_${address ? address : wallet?.account}`,
		async () => {
			if (defaults.address.phase1) {
				return await getPositions(pair, address ? address : wallet?.account)
			}
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
			enabled: ((address || !!wallet?.account) && !!pair),
		},
	)

	const [preQuote, setPreQuote] = useState(BigNumber.from(0))

	useEffect(() => {
		if (allocation &&
			totalWeightOfLockedPositions &&
			positionMultiplier &&
			position?.[2]
		) {
			try {
				console.log('here')
				console.log(subtract)
				const x = subtract === false ? position?.[2].add(ethers.BigNumber.from(positionAmount)) : position?.[2].sub(ethers.BigNumber.from(positionAmount))
				const a = allocation.mul(x).mul(positionMultiplier)
				const q = a.div(totalWeightOfLockedPositions > 0 ? totalWeightOfLockedPositions : 1)
				if (q.gte(allocation)) {
					setPreQuote(allocation)
				}
				else {
					setPreQuote(q)
				}
			}
			catch (error) {
				console.log(error)
			}
		}
	}, [
		allocation,
		totalWeightOfLockedPositions,
		positionAmount,
		positionMultiplier,
		subtract,
	])

	return {
		preQuote,
		refetchTotalWeightOfLockedPositions,
		refetchPosition,
	}
}
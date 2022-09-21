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
	address,
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
			position?.amount
		) {
			try {
				const a = allocation.mul(position.amount.add(ethers.BigNumber.from(positionAmount?.toFixed(0)))).mul(positionMultiplier)
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
		return () => setPreQuote(ethers.BigNumber.from(0))
	}, [
		allocation,
		totalWeightOfLockedPositions,
		positionAmount,
		positionMultiplier,
	])

	return {
		preQuote,
		refetchTotalWeightOfLockedPositions,
		refetchPosition,
	}
}
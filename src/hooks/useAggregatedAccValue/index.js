import { defaults } from '../../common'
import { useERC20Balance, useQuoteHalo } from '../'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'

export const useAggregatedAccValue = (
	address,
	staleTime = defaults.api.staleTime,
	refetchInterval = defaults.api.refetchInterval,
) => {

	const wallet = useWallet()
	const balance = useERC20Balance(defaults.address.halo, undefined, staleTime, refetchInterval)
	const [phase1Total, setPhase1Total] = useState(BigNumber.from('0'))
	const [aggregated, setAggregated] = useState(BigNumber.from('0'))
	const [isLoading, setIsLoading] = useState(true)

	const phase1 = {
		usdcEth: useQuoteHalo(defaults.address.uniswapV2Pairs.usdcEth, address, staleTime, refetchInterval),
		usdcUsdt: useQuoteHalo(defaults.address.uniswapV2Pairs.usdcUsdt, address, staleTime, refetchInterval),
		wbtcEth: useQuoteHalo(defaults.address.uniswapV2Pairs.wbtcEth, address, staleTime, refetchInterval),
		usdtEth: useQuoteHalo(defaults.address.uniswapV2Pairs.usdtEth, address, staleTime, refetchInterval),
		wbtcUsdc: useQuoteHalo(defaults.address.uniswapV2Pairs.wbtcUsdc, address, staleTime, refetchInterval),
	}

	useEffect(() => {
		if (!wallet.account) {
			setIsLoading(true)
			setPhase1Total(BigNumber.from('0'))
			setAggregated(BigNumber.from('0'))
		}
	}, [
		wallet.account,
	])

	useEffect(() => {
		if (balance.data &&
			phase1Total) {
			try {
				setAggregated(
					balance.data
						.add(phase1Total),
				)
			}
			catch (error) {
				console.log(error)
			}
		}
	}, [
		balance.data,
		phase1Total,
	])

	useEffect(() => {
		if(phase1.usdcEth.data &&
			phase1.usdcUsdt.data &&
			phase1.wbtcEth.data &&
			phase1.usdtEth.data &&
			phase1.wbtcUsdc.data
		) {
			setPhase1Total(Object.values(phase1)
				.reduce((total, pair) => {
					if (total &&
					pair.data) {
						try {
							const t = total.add(pair.data)
							return t
						}
						catch (error) {
							console.log(error)
						}
					}
				}, BigNumber.from('0')))
			setIsLoading(false)
		}
	}, [
		phase1.usdcEth.data,
		phase1.usdcUsdt.data,
		phase1.wbtcEth.data,
		phase1.usdtEth.data,
		phase1.wbtcUsdc.data,
	])

	const refetch = () => {
		phase1.usdcUsdt.refetch()
		phase1.wbtcEth.refetch()
		phase1.usdtEth.refetch()
		phase1.wbtcUsdc.refetch()
		balance.refetch()
	}

	return {
		total: aggregated,
		phase1Total: phase1Total,
		refetch: refetch,
		isLoading: isLoading,
	}
}
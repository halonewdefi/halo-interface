import { useUniV2AssetPrice } from '../useUniV2AssetPrice'
import { defaults } from '../../common'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export const useUniV2TokenQuantity = (
	pairAddress,
	token0Amount = ethers.BigNumber.from(0),
	token1Amount = ethers.BigNumber.from(0),
	token0Decimals = 0,
	token1Decimals = 0,
	staleTime = defaults.api.staleTime,
	refetchInterval = defaults.api.refetchInterval,
) => {

	const {
		token0Price: token0Price,
		token1Price: token1Price,
		token0Balance: token0Balance,
		token1Balance: token1Balance,
	} = useUniV2AssetPrice(
		pairAddress,
		false,
		staleTime,
		refetchInterval,
	)

	const [token0Quantity, setToken0Quantity] = useState(token0Amount)
	const [token1Quantity, setToken1Quantity] = useState(token1Amount)

	useEffect(() => {
		token0Balance.refetch()
		token1Balance.refetch()
	}, [
		token0Amount,
		token1Amount,
	])

	useEffect(() => {
		if (token0Amount &&
			token0Price) {
			try {
				setToken0Quantity(
					token0Amount,
				)
				const mpl = ethers.utils.parseUnits(Number(ethers.utils.formatUnits(token0Amount, token0Decimals)).toFixed(token1Decimals), token1Decimals)
				const rate = ethers.utils.parseUnits(token0Price.toFixed(token1Decimals), token1Decimals)
				const res = (ethers.utils.formatUnits(rate.mul(mpl), token1Decimals) / Math.pow(10, token1Decimals)).toFixed(token1Decimals)
				setToken1Quantity(
					ethers.utils.parseUnits(res, token1Decimals),
				)
			}
			catch (error) {
				console.log(error)
			}

		}
	}, [
		token0Amount,
		token0Price,
	])

	useEffect(() => {
		if (token1Amount &&
			token1Price) {
			try {
				setToken1Quantity(
					token1Amount,
				)
				const mpl = ethers.utils.parseUnits(Number(ethers.utils.formatUnits(token1Amount, token1Decimals)).toFixed(token0Decimals), token0Decimals)
				const rate = ethers.utils.parseUnits(token1Price.toFixed(token0Decimals), token0Decimals)
				const res = (ethers.utils.formatUnits(rate.mul(mpl), token0Decimals) / Math.pow(10, token0Decimals)).toFixed(token0Decimals)
				setToken0Quantity(
					ethers.utils.parseUnits(res, token0Decimals),
				)
			}
			catch (error) {
				console.log(error)
			}
		}
	}, [
		token1Amount,
		token1Price,
	])


	return {
		token0Quantity: token0Quantity,
		token1Quantity: token1Quantity,
		token0Price: token0Price,
		token1Price: token1Price,
	}
}
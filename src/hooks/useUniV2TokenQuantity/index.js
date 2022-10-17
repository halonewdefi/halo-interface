import { useUniV2AssetPrice } from '../useUniV2AssetPrice'
import { defaults } from '../../common'
import { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'

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
	const [vSync, setVsync] = useState(false)

	useEffect(() => {
		token0Balance.refetch()
		token1Balance.refetch()
	}, [
		token0Amount,
		token1Amount,
	])

	useEffect(() => {
		if (token0Amount &&
			token0Price &&
			!vSync) {
			try {
				setToken0Quantity(
					token0Amount,
				)
				const mpl = ethers.utils.parseUnits(ethers.utils.formatUnits(token0Amount, token0Decimals), token1Decimals)
				const rate = ethers.utils.parseUnits(token0Price.toFixed(token1Decimals), token1Decimals)
				const res = rate.mul(mpl).div(BigNumber.from('10').pow(token1Decimals))
				setToken1Quantity(
					res,
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
			token1Price &&
			!vSync) {
			try {
				setToken1Quantity(
					token1Amount,
				)
				const mpl = ethers.utils.parseUnits(ethers.utils.formatUnits(token1Amount, token1Decimals), token0Decimals)
				const rate = ethers.utils.parseUnits(token1Price.toFixed(token0Decimals), token0Decimals)
				const res = rate.mul(mpl).div(BigNumber.from('10').pow(token0Decimals))
				setToken0Quantity(
					res,
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
		setToken0Quantity,
		setToken1Quantity,
		setVsync,
	}
}
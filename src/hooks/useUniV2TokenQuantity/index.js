import { useUniV2AssetPrice } from '../useUniV2AssetPrice'
import { defaults } from '../../common'
import { useEffect } from 'react'

export const useUniV2TokenQunatity = (pairAddress, token0Amount, token1Amount, pollInterval = defaults.api.graphql.pollInterval) => {

	const {
		price: price,
		token0Balance: token0Balance,
		token1Balance: token1Balance,
	} = useUniV2AssetPrice(pairAddress, true, pollInterval)

	useEffect(() => {
		token0Balance.refetch()
		token1Balance.refetch()
	}, [
		token0Amount,
		token1Amount,
	])

	console.log(price)

	return {
		token0: 0,
		token1: 0,
		price: price,
	}
}
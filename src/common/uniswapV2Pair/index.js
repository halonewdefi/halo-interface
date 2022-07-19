import { ethers } from 'ethers'
import { UniswapV2Pair } from '../../artifacts'
import { defaults } from '..'

const getToken0 = async (pairAddress) => {
	const contract = new ethers.Contract(
		pairAddress,
		UniswapV2Pair,
		defaults.network.provider,
	)
	return await contract.token0()
}

const getToken1 = async (pairAddress) => {
	const contract = new ethers.Contract(
		pairAddress,
		UniswapV2Pair,
		defaults.network.provider,
	)
	return await contract.token1()
}

export {
	getToken0, getToken1,
}

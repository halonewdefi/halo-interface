import { ethers } from 'ethers'
import { defaults } from '../'
import { phase1 as phase1abi } from '../../artifacts'

const deposit = async (payableAmount, pairAddress, amount0, amount1, lockPeriodInDays, provider) => {
	const contract = new ethers.Contract(
		defaults.phase1address,
		phase1abi,
		provider.getSigner(0),
	)
	return await contract.deposit(
		payableAmount,
		pairAddress,
		amount0,
		amount1,
		lockPeriodInDays,
	)
}

export { deposit }
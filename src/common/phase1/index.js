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

const getAllocation = async () => {
	const contract = new ethers.Contract(
		defaults.address.phase1,
		phase1abi,
		defaults.network.provider,
	)
	return await contract.Halo_PER_PAIR()
}

const getEndTime = async () => {
	const contract = new ethers.Contract(
		defaults.address.phase1,
		phase1abi,
		defaults.network.provider,
	)
	return await contract.endTime()
}

export { deposit, getAllocation, getEndTime }
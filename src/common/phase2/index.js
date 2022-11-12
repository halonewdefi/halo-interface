import { ethers } from 'ethers'
import { defaults } from '..'
import { phase2 as phase2abi } from '../../artifacts'

const getEndTime = async () => {
	const contract = new ethers.Contract(
		defaults.address.phase2,
		phase2abi,
		defaults.network.provider,
	)
	return await contract.endTime()
}

const getStartTime = async () => {
	const contract = new ethers.Contract(
		defaults.address.phase2,
		phase2abi,
		defaults.network.provider,
	)
	return await contract.startTime()
}

const getAllocationForHalo = async () => {
	const contract = new ethers.Contract(
		defaults.address.phase2,
		phase2abi,
		defaults.network.provider,
	)
	return await contract.ALLOCATION_FOR_Halo()
}

const getAllocationForUSDC = async () => {
	const contract = new ethers.Contract(
		defaults.address.phase2,
		phase2abi,
		defaults.network.provider,
	)
	return await contract.ALLOCATION_FOR_USDC()
}

const getPositions = async (tokenAddress, address) => {
	const contract = new ethers.Contract(
		defaults.address.phase2,
		phase2abi,
		defaults.network.provider,
	)
	return await contract.positions(tokenAddress, address)
}

const depositStable = async (amount, lockPeriodInDays, provider) => {
	const contract = new ethers.Contract(
		defaults.address.phase2,
		phase2abi,
		provider.getSigner(0),
	)
	return await contract.depositStable(
		amount,
		lockPeriodInDays,
	)
}

export { getEndTime, getStartTime, getAllocationForHalo, getAllocationForUSDC,
	getPositions, depositStable }
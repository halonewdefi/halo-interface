import { ethers } from 'ethers'
import { defaults } from '../'
import { phase1 as phase1abi } from '../../artifacts'

const deposit = async (pairAddress, amount0, amount1, lockPeriodInDays, provider) => {
	const contract = new ethers.Contract(
		defaults.address.phase1,
		phase1abi,
		provider.getSigner(0),
	)
	return await contract.deposit(
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

const getTotalWeightOfLockedPositions = async (pair) => {
	const contract = new ethers.Contract(
		defaults.address.phase1,
		phase1abi,
		defaults.network.provider,
	)
	return await contract._totalWeightOfLockedPositions(pair)
}

const quoteHalo = async (pair, address) => {
	const contract = new ethers.Contract(
		defaults.address.phase1,
		phase1abi,
		defaults.network.provider,
	)
	return await contract.quoteHalo(pair, address)
}

const getPositions = async (pair, address) => {
	const contract = new ethers.Contract(
		defaults.address.phase1,
		phase1abi,
		defaults.network.provider,
	)
	return await contract.positions(pair, address)
}


export { deposit, getAllocation, getEndTime,
	getTotalWeightOfLockedPositions, quoteHalo,
	getPositions }
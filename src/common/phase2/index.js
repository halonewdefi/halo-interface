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


export { getEndTime, getStartTime }
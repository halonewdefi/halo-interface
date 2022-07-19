import { ethers } from 'ethers'
import { humanStandardToken } from '../../artifacts'
import { defaults } from '..'

const approveERC20ToSpend = async (tokenAddress, spenderAddress, amount, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		provider.getSigner(0),
	)
	return await contract.approve(spenderAddress, amount)
}

const getERC20Allowance = async (tokenAddress, ownerAddress, spenderAddress, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		provider,
	)
	return await contract.allowance(ownerAddress, spenderAddress)
}

const getERC20BalanceOf = async (tokenAddress, address, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		provider,
	)
	return await contract.balanceOf(address)
}

const getERC20TotalSupply = async (tokenAddress) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		defaults.network.provider,
	)
	return await contract.totalSupply()
}

const getERC20Decimals = async (tokenAddress) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		defaults.network.provider,
	)
	return await contract.decimals()
}

const resolveUnknownERC20 = async (tokenAddress, logoURI = '') => {
	let token
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		defaults.network.provider,
	)
	const address = await contract.resolvedAddress
	const name = await contract.name().then(r => { return r }).catch(err => console.log(err))
	const symbol = await contract.symbol().then(r => { return r }).catch(err => console.log(err))
	const decimals = await contract.decimals().then(r => { return r.toNumber() }).catch(err => console.log(err))

	if (
		address &&
		name &&
		symbol &&
		decimals &&
		defaults.network.chainId
	) {
		token = {
			'chainId':defaults.network.chainId,
			'address':address,
			'name':name,
			'symbol':symbol,
			'decimals':decimals,
			'logoURI':logoURI,
		}
	}
	return token
}

export {
	approveERC20ToSpend, getERC20BalanceOf, resolveUnknownERC20,
	getERC20Allowance, getERC20TotalSupply, getERC20Decimals,
}

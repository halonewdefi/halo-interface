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

const getERC20Symbol = async (tokenAddress) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		defaults.network.provider,
	)
	return await contract.symbol()
}

const getERC20Name = async (tokenAddress) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		defaults.network.provider,
	)
	return await contract.name()
}

const resolveUnknownERC20 = async (tokenAddress) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardToken,
		defaults.network.provider,
	)
	const address = await contract.resolvedAddress
	const name = await contract.name()
	const symbol = await contract.symbol()
	const decimals = await contract.decimals()

	const token = {
		'chainId':defaults.network.chainId,
		'address':address ? address : tokenAddress,
		'name':name ? name : '',
		'symbol':symbol === 'WETH' ? 'ETH' : symbol ? symbol : '',
		'decimals':decimals ? decimals : '',
		'logoURI':`svg/tokens/${address ? address : tokenAddress}/index.svg`,
	}

	return token
}

export {
	approveERC20ToSpend, getERC20BalanceOf, resolveUnknownERC20,
	getERC20Allowance, getERC20TotalSupply, getERC20Decimals,
	getERC20Symbol, getERC20Name,
}

import { ethers } from 'ethers'
import getTokenList from 'get-token-list'
import { defaults } from '../'

const prettifyAddress = (address, prependN) => {
	if (address) {
		return `${prependN > 0 ? `${address.substring(0, prependN)}...` : ''}${address.substring(address.length - 4, address.length)}`
	}
}

const prettifyCurrency = (amount, minFractionDigits = 0, maxFractionDigits = 2, currency = 'USD', locales = 'en-US') => {
	let symbol = ''
	let symbolPrepended = false
	let cryptocurrency = false
	let options = {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: minFractionDigits,
		maximumFractionDigits: maxFractionDigits,
	}

	if (currency === 'ETH' || currency === 'WETH') {
		options = {
			style: 'decimal',
			minimumFractionDigits: minFractionDigits,
			maximumFractionDigits: maxFractionDigits,
		}
		symbol = 'Ξ'
		symbolPrepended = false
		cryptocurrency = true
	}

	if (currency === 'HALO') {
		options = {
			style: 'decimal',
			minimumFractionDigits: minFractionDigits,
			maximumFractionDigits: maxFractionDigits,
		}
		symbol = 'HALO'
		symbolPrepended = false
		cryptocurrency = true
	}

	const currencyValue = new Intl.NumberFormat(locales, options)

	return (
		cryptocurrency ? `${symbolPrepended ? symbol + '\u00A0' : ''}${currencyValue.format(amount)}${symbolPrepended ? '' : '\u00A0' + symbol}`
			: currencyValue.format(amount)
	)
}

const prettifyNumber = (amount, minFractionDigits = 0, maxFractionDigits = 0, locales = 'en-US', notation = 'standard') => {
	const options = {
		minimumFractionDigits: minFractionDigits,
		maximumFractionDigits: maxFractionDigits,
		notation: notation,
	}
	const value = isFinite(amount) ? amount : 0
	return (new Intl.NumberFormat(locales, options).format(value))
}

const getPercentage = (amount, minFractionDigits = 0, maxFractionDigits = 2, locales = 'en-US') => {
	const options = {
		style: 'percent',
		minimumFractionDigits: minFractionDigits,
		maximumFractionDigits: maxFractionDigits,
	}
	const value = isFinite(amount) ? amount : 0
	return (new Intl.NumberFormat(locales, options).format(value))
}

const getDateFromSeconds = (seconds) => {
	return new Date(seconds * 1000)
}

const getSecondsToGo = (date) => {
	const time = (Date.now() / 1000).toFixed()
	return (Number((date - time)))
}

const getDateFromTimestamp = (timestamp) => {
	const date = new Date(timestamp * 1000)
	return date
}

const promiseAllProgress = (promises, tickCallback) => {
	const numPromises = promises.length
	let progress = 0
	function tick(promise) {
		promise.then(() => {
			progress++
			typeof tickCallback === 'function' && tickCallback(progress / numPromises)
		})
		return promise
	}
	return Promise.all(promises.map(tick))
}

const searchFor = (array, string, callBack, regEx = new RegExp(`(${string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})+`, 'gi')) => {
	const object = array.reduce((acc, item, index) => {
		if (Object.keys(item).find(key => String(item[key]).match(regEx))) acc[index] = item
		return acc
	}, {})
	if(callBack) {
		callBack(Object.values(object))
	}
	else {
		return Object.values(object)
	}
}

const isEthereumAddress = (string) => {
	const regEx = new RegExp('^0x[a-fA-F0-9]{40}$')
	return regEx.test(string)
}

const isEven = (num) => num % 2 === 0

const addUnknownTokenToList = (tokenList, newToken) => {
	if (!newToken) {
		return tokenList
	}
	const newList = tokenList
	const index = newList.findIndex(token => token.chainId == newToken.chainId && token.address.toLowerCase() == newToken.address.toLowerCase())
	if (index >= 0) {
		newList[index] = {
			'chainId': newToken.chainId || newList[index].chainId,
			'address': newToken.address || newList[index].address,
			'name': newToken.name || newList[index].name,
			'symbol': newToken.symbol || newList[index].symbol,
			'decimals': newToken.decimals || newList[index].decimals,
			'logoURI': newToken.logoURI || newList[index].logoURI,
		}
	}
	else {
		newList.push(newToken)
	}
	return newList
}

const getCombinedTokenListFromSources = (sources) => {
	return Promise.all(
		sources.filter((source) => source.enabled === true)
			.map((source) => {
				const p = getTokenList(source.url)
					.then(d => d.tokens.filter(token => token.chainId == defaults.network.chainId))
				return p
			})).then(data => {
		return data.flat()
	})
}

const getTokenByAddress = async (address) => {
	const list = await getCombinedTokenListFromSources(defaults.tokenList.sources)
	const tokenObj = await list.find(token => token.address === String(address))
	return tokenObj
}

const getStartOfTheDayTimeStamp = () => {
	const today = new Date()
	const dd = String(today.getUTCDate()).padStart(2, '0')
	const mm = String(today.getUTCMonth() + 1).padStart(2, '0')
	const yyyy = today.getUTCFullYear()
	const currentDate = `${yyyy}-${mm}-${dd}`
	return Math.floor(new Date(currentDate).getTime() / 1000)
}

const calculateDifference = (value1, value2) => value1 > value2 ?
	(value1 - value2) / value2 : (value1 - value2) / value1

const openNewTabURL = (url) => {
	const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
	if (newWindow) newWindow.opener = null
}

const handleTokenInput = (setAmount, setValue, e, token) => {
	if (isNaN(e.target.value)) {
		setAmount(prev => prev)
	}
	else {
		setAmount(String(e.target.value))
		if(Number(e.target.value) >= 0) {
			try {
				setValue(
					ethers.utils.parseUnits(String(e.target.value),
						token.data?.decimals),
				)
			}
			catch(err) {
				if (err.code === 'NUMERIC_FAULT') {
					// value too small
				}
			}
		}
	}
}

export {
	prettifyAddress, prettifyCurrency, prettifyNumber, getPercentage, getSecondsToGo,
	promiseAllProgress, searchFor, isEthereumAddress, addUnknownTokenToList, getCombinedTokenListFromSources,
	getTokenByAddress, getStartOfTheDayTimeStamp,
	calculateDifference, getDateFromSeconds, getDateFromTimestamp, openNewTabURL,
	handleTokenInput, isEven,
}

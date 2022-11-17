import { useQuery } from 'react-query'
import { getHaloDeposited, getUsdc, getUsdcDeposited, getUsdcPerHalo } from '../../common'
import { defaults } from '../../common'
import { useUnknownERC20Resolve } from '../useUnknownERC20Resolve'
import { ethers } from 'ethers'

export const useHaloPrice = (
	swapTokens = false,
	staleTime = defaults.api.staleTime,
	refetchInterval = defaults.api.refetchInterval,
) => {

	const { data: token0 } = useQuery(`${defaults.address.phase2}_usdc`,
		async () => {
			return await getUsdc()
		}, {
			staleTime: staleTime,
			refetchInterval: false,
		},
	)

	const { data: usdc } = useUnknownERC20Resolve(token0)

	const usdcPerHalo = useQuery(`${defaults.address.phase2}_usdcPerHalo`,
		async () => {
			return await getUsdcPerHalo()
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
		},
	)

	const usdcDeposited = useQuery(`${defaults.address.phase2}_usdcDeposited`,
		async () => {
			return await getUsdcDeposited()
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
		},
	)

	const haloDeposited = useQuery(`${defaults.address.phase2}_haloDeposited`,
		async () => {
			return await getHaloDeposited()
		}, {
			staleTime: staleTime,
			refetchInterval: refetchInterval,
		},
	)

	const refetch = () => {
		usdcPerHalo.refetch()
		usdcDeposited.refetch()
		haloDeposited.refetch()
	}

	let p

	if (usdcPerHalo.data <= 0 &&
		usdc &&
		usdcDeposited.data &&
		haloDeposited.data) {
		// if (!swapTokens) p = ethers.utils.parseUnits((usdcDeposited.data / ethers.utils.parseUnits(ethers.utils.formatEther(haloDeposited.data), usdc.decimals)).toFixed(usdc.decimals), usdc.decimals)
		// if (swapTokens) p = ethers.utils.parseEther(haloDeposited.data.div(ethers.utils.parseUnits(ethers.utils.formatUnits(usdcDeposited.data, usdc.decimals), 18)).toString())
		if (!swapTokens) p = ((ethers.utils.formatUnits(usdcDeposited?.data, usdc.decimals)) / (ethers.utils.formatUnits(haloDeposited?.data, 18))).toFixed(usdc.decimals)
		if (swapTokens) p = ((ethers.utils.formatUnits(haloDeposited?.data, 18)) / (ethers.utils.formatUnits(usdcDeposited?.data, usdc.decimals))).toFixed(18)
	}

	return {
		data: p,
		usdcDeposited: usdcDeposited,
		refetch: refetch,
	}
}
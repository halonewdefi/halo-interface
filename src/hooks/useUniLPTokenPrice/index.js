import { gql, useQuery as useApolloQuery } from '@apollo/client'
import { useQuery } from 'react-query'
import { getERC20TotalSupply } from '../../common/erc20utils'
import { getToken0, getToken1 } from '../../common/uniswapV2Pair'
import { useERC20Balance } from '../useERC20Balance'
import { utils } from 'ethers'
import { defaults, getERC20Decimals } from '../../common'

export const useUniLPTokenPrice = (pairAddress, staleTime = defaults.api.staleTime) => {

	const { data: token0 } = useQuery(`${pairAddress}_token0`,
		async () => {

			if (pairAddress) {
				return await getToken0(
					pairAddress,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	const { data: token1 } = useQuery(`${pairAddress}_token1`,
		async () => {

			if (pairAddress) {
				return await getToken1(
					pairAddress,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	const { data: token0decimals } = useQuery(`${token0}_decimals`,
		async () => {

			if (token0) {
				return await getERC20Decimals(
					token0,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!token0,
		},
	)

	const { data: token1decimals } = useQuery(`${token1}_decimals`,
		async () => {

			if (token1) {
				return await getERC20Decimals(
					token1,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!token1,
		},
	)

	// Use test value on non-mainnet chain
	// token0_contains: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
	const { data: token0price } = useApolloQuery(gql`
		query {
			pairs(
				where: {
					token0_contains: "${token0?.toLowerCase()}",
					token1_contains: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
				},
				orderDirection: desc
			) {
				token1Price
			}
		}
	`)

	const { data: token1price } = useApolloQuery(gql`
		query {
			pairs(
				where: {
					token0_contains: "${token0?.toLowerCase()}",
					token1_contains: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
				},
				orderDirection: desc
			) {
				token1Price
			}
		}
	`, {
		client: defaults.api.graphql.client.uniswapV2,
		pollInterval: defaults.api.graphql.pollInterval,
	})

	const { data: token0balance } = useERC20Balance(token0, pairAddress)
	const { data: token1balance } = useERC20Balance(token1, pairAddress)

	const { data: totalSupply } = useQuery(`${pairAddress}_totalSupply`,
		async () => {

			if (pairAddress) {
				return await getERC20TotalSupply(
					pairAddress,
				)
			}

		}, {
			staleTime: staleTime,
			enabled: !!pairAddress,
		},
	)

	if (token0balance &&
		token1balance &&
		token0decimals &&
		token1decimals) {
		const token0totalValue = (utils.formatUnits(token0balance, token0decimals) * token0price?.pairs?.[0]?.token1Price)
		const token1totalValue = (utils.formatUnits(token1balance, token1decimals) * token1price?.pairs?.[0]?.token1Price)
		if (token0totalValue && token1totalValue) {
			if (totalSupply) {
				const supply = Number(utils.formatUnits(totalSupply, 18))
				const totalPoolValue = (token0totalValue + token1totalValue)
				const lpTokenPrice = (totalPoolValue / supply)
				return utils.parseEther(String(lpTokenPrice))
			}
		}
	}
}
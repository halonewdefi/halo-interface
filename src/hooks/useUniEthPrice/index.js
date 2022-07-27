import { gql, useQuery as useApolloQuery } from '@apollo/client'
import { defaults } from '../../common'

export const useUniEthPrice = (pollInterval = defaults.api.graphql.pollInterval) => {

	const ethPrice = useApolloQuery(gql`
		query {
			pairs(
				where: {
					token0_contains: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
					token1_contains: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
				},
				orderDirection: desc
			) {
				token0Price
			}
		}
	`, {
		client: defaults.api.graphql.client.uniswapV2,
		pollInterval: pollInterval,
	})

	return ethPrice
}
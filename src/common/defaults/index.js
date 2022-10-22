import { InMemoryCache, ApolloClient } from '@apollo/client'
import { QueryClient } from 'react-query'
import { ethers } from 'ethers'
import tokenListSources from '../../tokenListSources.json'
import address from '../address'
import lockdropPairs from '../lockdropPairs'

const defaults = {}

defaults.network = {}
defaults.network.chainId = Number(process.env.REACT_APP_CHAIN_ID)
defaults.network.provider = new ethers.providers.FallbackProvider(
	[
		{
			provider: new ethers.providers.AlchemyProvider(
				defaults.network.chainId,
				process.env.REACT_APP_ALCHEMY_KEY,
			),
			weight: 1,
			priority: 1,
			stallTimeout: 2000,
		},
		{
			provider: new ethers.providers.InfuraProvider(
				defaults.network.chainId,
				process.env.REACT_APP_INFURA_KEY,
			),
			weight: 1,
			priority: 2,
			stallTimeout: 2000,
		},
	],
	1,
)

defaults.network.connectors = {
	metamask: {
		meta: {
			key: 'injected',
			name: 'MetaMask',
			logo: '/svg/icons/' +
			'metamask.svg',
		},
	},
	walletlink: {
		// WalletLink supports only ChainID 1
		chainId: 1,
		url: (
			defaults.network.chainId === 1 ?
				`http://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}` :
				undefined
		),
		appName: 'HaloSwap',
		appLogoUrl: 'https://raw.githubusercontent.com/halonewdefi/halo-branding/main/' +
			'logo-main.svg',
		meta: {
			key: 'walletlink',
			name: 'Coinbase Wallet',
			logo: 'svg/icons/' +
			'coinbasewallet.svg',
		},
	},
	walletconnect: {
		rpc: {
			[defaults.network.chainId]: (
				defaults.network.chainId === 5 ?
					`https://eth-goerli.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}` :
					undefined
			),
		},
		meta: {
			key: 'walletconnect',
			name: 'WalletConnect',
			logo: '/svg/icons/' +
			'walletconnect.svg',
		},
	},
	other: {
		meta: {
			key: 'injected',
			name: 'Other',
			logo: '/svg/icons/' +
			'otherwallets.svg',
		},
	},
}
defaults.network.autoConnect = true
defaults.network.pollInterval = 100000

defaults.network.tx = {}
defaults.network.tx.confirmations = 1

defaults.network.blockTime = {}
defaults.network.blockTime.second = (
	defaults.network.chainId === 1 ? 0.07570023 :
		defaults.network.chainId === 42 ? 0.25 :
			0)
defaults.network.blockTime.minute = defaults.network.blockTime.second * 60
defaults.network.blockTime.hour = defaults.network.blockTime.minute * 60
defaults.network.blockTime.day = defaults.network.blockTime.hour * 24

defaults.network.erc20 = {}
defaults.network.erc20.maxApproval = '0x8000000000000000000000000000000000000000000000000000000000000000'

defaults.api = {}
defaults.api.refetchInterval = 60000
defaults.api.staleTime = 600000
defaults.api.client = new QueryClient()

defaults.api.graphql = {}
defaults.api.graphql.uri = {}
defaults.api.graphql.uri.uniswapV2 = (
	defaults.network.chainId === 1 ? 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2' :
		undefined
)

defaults.api.graphql.cache = new InMemoryCache()
defaults.api.graphql.client = {}
defaults.api.graphql.client.uniswapV2 = new ApolloClient({
	uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
	cache: defaults.api.graphql.cache,
})
defaults.api.graphql.client.default = defaults.api.graphql.client.uniswapV2
defaults.api.graphql.pollInterval = 600000

defaults.api.etherscanUrl = (
	defaults.network.chainId === 1 ? 'https://etherscan.io' :
		defaults.network.chainId === 5 ? 'https://goerli.etherscan.io' :
			undefined
)

defaults.tokenList = {}
defaults.tokenList.sources = tokenListSources

defaults.address = (
	defaults.network.chainId === 5 ? address.goerli :
		undefined
)
defaults.lockdropPairs = (
	defaults.network.chainId === 5 ? lockdropPairs.goerli :
		undefined
)

defaults.ether = {
	'name':'ETHER',
	'symbol':'ETH',
	'decimals':18,
	'logoURI':'/svg/tokens/0x0/index.svg',
	'isEther': true,
}

defaults.layout = {}
defaults.layout.header = {}
defaults.layout.header.width = '100%'
defaults.layout.header.padding = '.888rem'
defaults.layout.header.minHeight = '41px'

defaults.layout.container = {}
defaults.layout.container.padding = { base: '.888rem .888rem 6.2rem', md : '0 .888rem  .888rem' }
defaults.layout.container.xl = {}
defaults.layout.container.xl.width = '75rem'
defaults.layout.container.lg = {}
defaults.layout.container.lg.width = '65rem'
defaults.layout.container.lg.padding = { base: '0 1.25rem 6.2rem', md: '0 2.5rem .888rem' }
defaults.layout.container.md = {}
defaults.layout.container.md.width = '840px'
defaults.layout.container.sm = {}
defaults.layout.container.sm.width = '768px'

defaults.layout.modal = {}
defaults.layout.modal.body = {}
defaults.layout.modal.body.minH = '138px'
defaults.layout.modal.closeButton = {}
defaults.layout.modal.closeButton.top = '1.29rem'

defaults.toast = {}
defaults.toast.duration = 5000
defaults.toast.txHashDuration = 8000
defaults.toast.closable = true
defaults.toast.position = 'top'

defaults.tooltip = {}
defaults.tooltip.delay = 800

export { defaults }

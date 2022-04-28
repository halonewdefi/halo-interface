import React, {} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import theme from './themes/halo'
import { UseWalletProvider } from 'use-wallet'
import { Header } from './components'
import defaults from './common/defaults'
import { Lockdrop } from './locations'

const App = () => {

	return (
		<Router>
			<ChakraProvider theme={theme}>
				<UseWalletProvider
					chainId={defaults.network.chainId}
					connectors={defaults.network.connectors}
					autoConnect={defaults.network.autoConnect}
				>
					<Header
						width={defaults.layout.header.width}
						p={defaults.layout.header.padding}
					/>
					<Flex
						w='100%'
						maxW={defaults.layout.container.xl.width}
						m='0 auto'
						p={defaults.layout.container.padding}>
						<Switch>
							<Route path='/' exact render={() =>
								<Lockdrop/>
							}/>
							<Route path='*' render={() =>
								<Redirect to={'/'} />
							} />
						</Switch>
					</Flex>
      	</UseWalletProvider>
			</ChakraProvider>
		</Router>
	)
}

export default App

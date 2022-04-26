import React, {} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ChakraProvider, Box } from '@chakra-ui/react'
import theme from './themes/halo'
import { UseWalletProvider } from 'use-wallet'
import { Header } from './components'
import defaults from './common/defaults'
import { Swap } from './locations'

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
					<Box p={defaults.layout.container.padding}>
						<Switch>
							<Route path='/' exact render={() =>
								<Swap/>
							}/>
							<Route path='*' render={() =>
								<Redirect to={'/'} />
							} />
						</Switch>
					</Box>
      	</UseWalletProvider>
			</ChakraProvider>
		</Router>
	)
}

export default App

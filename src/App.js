import React, {} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import theme from './themes/halo'
import { UseWalletProvider } from 'use-wallet'
import { Header, Logomark } from './components'
import { defaults } from './common'
import { Lockdrop } from './locations'
import { Footer } from './components/Footer'

const App = () => {

	return (
		<Router>
			<ChakraProvider theme={theme}>
				<UseWalletProvider
					chainId={defaults.network.chainId}
					connectors={defaults.network.connectors}
					autoConnect={defaults.network.autoConnect}
				>
					<Logomark/>
					<Header
						w='100%'
						m='0 auto'
						maxW={defaults.layout.container.xl.width}
						p={defaults.layout.header.padding}
					/>
					<Flex
						w='100%'
						maxW={defaults.layout.container.xl.width}
						flexDir='column'
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
					<Footer
						maxW={defaults.layout.container.xl.width}
						p={defaults.layout.header.padding}
					/>
      	</UseWalletProvider>
			</ChakraProvider>
		</Router>
	)
}

export default App

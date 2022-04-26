import { ColorModeScript } from '@chakra-ui/react'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import theme from './themes/halo'
import App from './App'
import defaults from './common/defaults'
import { ApolloProvider } from '@apollo/client'
import { QueryClientProvider } from 'react-query'
import reportWebVitals from './reportWebVitals'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
	<StrictMode>
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		<ApolloProvider client={defaults.api.graphql.client.uniswapV2}>
			<QueryClientProvider client={defaults.api.client}>
				<App />
			</QueryClientProvider>
		</ApolloProvider>
	</StrictMode>,
	document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

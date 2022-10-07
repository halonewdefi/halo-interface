import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Flex, Button, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import { Logo, WalletConnectionToggle, ColorModeSwitcher } from '../../components'
import { defaults } from '../../common'
import { BurgerMenu } from '../BurgerMenu'

export const Header = (props) => {

	const location = useLocation()
	const pages = [
		{
			name: 'Lockdrop',
			text: 'Lockdrop',
			link: '/',
		},
	]

	const current = {
		fontWeight: '1000',
	}

	return (
		<Flex
			justifyContent='space-between'
			alignItems='center'
			flexWrap={{ base: 'wrap', md: 'nowrap' }}
			gridGap='1.2rem'
			pos={{ base: 'fixed', md: 'initial' }}
			borderTop={{ base: useColorModeValue('1px solid var(--chakra-colors-stroke-dark)',
				'1px solid var(--chakra-colors-stroke-light)'), md: '0' }}
			background={{ base: useColorModeValue('bg.light', 'bg.dark'), md: 'transparent' }}
			bottom='0'
			zIndex='9'
			{...props}>
			{useBreakpointValue({
				base: <BurgerMenu pages={pages}/>,
				md: <Logo />,
			})}
			<Flex
				gridGap='12.3px'
				flex='1 0 auto'
				alignItems='center'
				minH={defaults.layout.header.minHeight}
			>
				{useBreakpointValue({
					base: '',
					// md: <>
					// 	{pages.map(p =>
					// 		<Link
					// 			key={p.name}
					// 			to={p.link}
					// 		>
					// 			<Button
					// 				variant='link'
					// 				style={{
					// 					...(location.pathname === '/' && p.name === 'Home' && current),
					// 					...(p.link === location.pathname && current),
					// 				}}
					// 			>
					// 				{p.text}
					// 			</Button>
					// 		</Link>)
					// 	}
					// </>,
				})}
			</Flex>
			<Flex
 				justifyContent='flex-end'
				gridGap='1.2rem'
			>
				<ColorModeSwitcher/>
				<WalletConnectionToggle/>
			</Flex>
		</Flex>
	)
}

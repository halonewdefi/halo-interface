import React from 'react'
import { useLocation } from 'react-router-dom'
import { Flex, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Logotype, WalletConnectionToggle, ColorModeSwitcher } from '../../components'
import defaults from '../../common/defaults'

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
			bottom='0'
			{...props}>
			<Logotype />
			<Flex
				gridGap='12.3px'
				flex='1 0 auto'
				alignItems='center'
				minH={defaults.layout.header.minHeight}
			>
				{pages.map(p =>
					<Link
						key={p.name}
						to={p.link}
					>
						<Button
							variant='link'
							style={ {
								...(location.pathname === '/' && p.name === 'Home' && current),
								...(p.link === location.pathname && current),
							}}
						>
							{p.text}
						</Button>
					</Link>)
				}
			</Flex>
			<Flex
 				justifyContent='flex-end'
				gridGap='1.2rem'
			>
				<WalletConnectionToggle/>
				<ColorModeSwitcher/>
			</Flex>
		</Flex>
	)
}

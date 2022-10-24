import React from 'react'
import { useBreakpointValue, Flex, Link, Icon } from '@chakra-ui/react'
import { RiDiscordFill, AiFillTwitterCircle, FaTelegramPlane, BsMedium } from 'react-icons/all'
import { Divider } from '../Divider'
import { defaults } from '../../common'

export const Footer = (props) => {

	const size = {
		width: '32px',
		height: 'auto',
	}

	return (<>
		{useBreakpointValue({
			base: '',
			md: <Flex
				flexDir='column'
				margin='0 auto'
				{...props}
			>
				<Divider
					marginTop='5rem'
				/>
				<Flex
					flexDir='row'
					justifyContent='space-between'
					opacity='0.65'
					fontWeight='400'
				>
					<Flex
						flexDir='row'
						gap='.5rem'
					>
						<Link
							href={defaults.external.media.discord}
							isExternal>
							<Icon
								as={RiDiscordFill}
								{...size}
							/>
						</Link>

						<Link
							href={defaults.external.media.twitter}
							isExternal>
							<Icon
								as={AiFillTwitterCircle}
								{...size}
							/>
						</Link>

						<Link
							href={defaults.external.media.medium}
							isExternal>
							<Icon
								as={BsMedium}
								{...size}
							/>
						</Link>

						<Link
							href={defaults.external.media.telegram}
							isExternal>
							<Icon
								as={FaTelegramPlane}
								{...size}
							/>
						</Link>
					</Flex>
					<Flex>
							© {(new Date).getFullYear()} Haloswap
					</Flex>
				</Flex>
			</Flex>,
		})}
	</>
	)
}

import React from 'react'
import { Flex, Box, Image } from '@chakra-ui/react'

export const LockersList = (props) => {

	const tokeIconStyle = {
		h: 'auto',
		maxW: '24px',
	}

	const Card = () => {
		return (
			<Flex
				flex={{ sm: '100%', md: '32%' }}
				flexDir='column'
				h='130px'
				maxW={{ sm: '100%', md: '49%', lg: '31%' }}
				w='100%'
				p='1.2rem .8rem'
				justifyContent='space-between'
				layerStyle='card'
			>
				<Flex
					flexDir='row'
					justifyContent='space-between'
					alignItems='center'
				>
					<Flex
						flexDir='row'
						gridGap='.34rem'
					>
						<Image
							src='https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg'
							{...tokeIconStyle}
						/>
						<Image
							src='https://dollar-earn-3tkbe63sc.vercel.app/svg/tokens/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/index.svg'
							{...tokeIconStyle}
						/>
					</Flex>
					<Box as='h4'>
						WBTC-USDV
					</Box>
				</Flex>

				<Flex
					flexDir='row'
				>
					<Flex
						gridGap='1.3rem'
					>
						<Flex
							flexDir='column'
						>
							<Box>200M</Box>
							<Box>Size</Box>
						</Flex>
						<Flex
							flexDir='column'
						>
							<Box>30%</Box>
							<Box>APR</Box>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		)
	}

	return (
		<Flex
			flexDir='row'
			flexWrap='wrap'
			gridGap='1.7rem'
			{...props}>
			<Card/>
			<Card/>
			<Card/>
			<Card/>
			<Card/>
			<Card/>
			<Card/>
		</Flex>
	)
}

/* eslint-disable react/prop-types */
import React from 'react'
import { Flex, Box, Image } from '@chakra-ui/react'

const Card = (props) => {

	const tokeIconStyle = {
		h: 'auto',
		w: '24px',
	}

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
						src={props.icon}
						{...tokeIconStyle}
					/>
					<Image
						src='https://dollar-earn-3tkbe63sc.vercel.app/svg/tokens/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/index.svg'
						{...tokeIconStyle}
					/>
				</Flex>
				<Box as='h4'>
					{props.pair}
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
						<Box>{props.size}</Box>
						<Box>Size</Box>
					</Flex>
					<Flex
						flexDir='column'
					>
						<Box>{props.apr}</Box>
						<Box>APR</Box>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}

export const LockersList = (props) => {

	const tokens = [
		{
			id: 0,
			pair: 'WBTC-USDV',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
			size: '200M',
			apr: '30%',
		},
		{
			id: 1,
			pair: 'ETH-USDV',
			icon: 'https://svgarchive.com/wp-content/uploads/ethereum-eth.svg',
			size: '900M',
			apr: '10%',
		},
		{
			id: 2,
			pair: 'LUNA-USDV',
			icon: 'https://cryptologos.cc/logos/terra-luna-luna-logo.svg?v=022',
			size: '400M',
			apr: '20%',
		},
		{
			id: 3,
			pair: 'DOGE-USDV',
			icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=022',
			size: '300M',
			apr: '31%',
		},
		{
			id: 4,
			pair: 'RUNE-USDV',
			icon: 'https://cryptologos.cc/logos/thorchain-rune-logo.svg?v=022',
			size: '100M',
			apr: '33%',
		},
	]

	return (
		<Flex
			flexDir='row'
			flexWrap='wrap'
			gridGap='1.7rem'
			{...props}>
			{tokens.map(p => <Card
				pair={p.pair}
				icon={p.icon}
				size={p.size}
				apr={p.apr}
				key={p.id}
			/>)}
		</Flex>
	)
}

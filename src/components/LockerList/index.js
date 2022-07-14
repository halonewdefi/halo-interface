/* eslint-disable react/prop-types */
import React from 'react'
import { Flex, Box, Image } from '@chakra-ui/react'
import { defaults } from '../../common'

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
						src={`/svg/tokens/${props.token0}/index.svg`}
						{...tokeIconStyle}
					/>
					<Image
						src={`/svg/tokens/${props.token1}/index.svg`}
						{...tokeIconStyle}
					/>
				</Flex>
				<Box as='h4'>
					{props.pair}
				</Box>
			</Flex>

			{(props.size) || (props.apr) &&
						<Flex
							flexDir='row'
						>
							<Flex
								gridGap='1.3rem'
							>
								<Flex
									flexDir='column'
								>
									{props.size &&
									<>
										<Box>{props.size}</Box>
										<Box>Size</Box>
									</>
									}
								</Flex>
								<Flex
									flexDir='column'
								>
									{props.apr &&
									<>
										<Box>{props.apr}</Box>
										<Box>APR</Box>
									</>
									}
								</Flex>
							</Flex>
						</Flex>
			}
		</Flex>
	)
}

export const LockersList = (props) => {

	return (
		<Flex
			flexDir='row'
			flexWrap='wrap'
			gridGap='1.7rem'
			{...props}>
			{defaults.lockdropPairs.map(p => <Card
				pair={p.pair}
				address={p.address}
				token0={p.token0}
				token1={p.token1}
				key={p.address}
			/>)
			}
		</Flex>
	)
}

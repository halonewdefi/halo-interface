/* eslint-disable react/prop-types */
import React from 'react'
import { Flex, Box, Image, Skeleton } from '@chakra-ui/react'
import { defaults, prettifyNumber } from '../../common'
import { usePhase1Allocation } from '../../hooks'
import { utils } from 'ethers'
import address from '../../common/address'

const Card = (props) => {

	const allocation = usePhase1Allocation()

	const tokeIconStyle = {
		h: 'auto',
		w: '24px',
	}

	const valuStyle = {
		display: 'flex',
		flexDirection: 'row',
		gridGap: '0.4rem',
		fontWeight: '600',
		minHeight: '24px',
	}

	const descStyle = {
		fontSize: '0.899rem',
		minHeight: '24px',
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

			<Flex
				flexDir='row'
			>
				<Flex
					gridGap='1.333rem'
				>
					<Flex
						flexDir='column'
					>
						<>
							<Skeleton
								isLoaded={true}
							>
								<Box
									style={valuStyle}
								>
									{
										`$${prettifyNumber(1342400, 0, 2, 'US', 'compact')}`
									}
								</Box>
							</Skeleton>
							<Box
								style={descStyle}
							>
								TVL
							</Box>
						</>
					</Flex>

					<Flex
						flexDir='column'
					>
						<>
							<Skeleton
								isLoaded={!allocation.isLoading}
							>
								<Box
									style={valuStyle}
								>
									{allocation.data &&
										prettifyNumber(utils.formatEther(allocation?.data), 0, 0, 'US', 'compact')
									}
									<Image
									 {...tokeIconStyle}
									 src={`svg/tokens/${address.goerli.halo}/index.svg`}/>
								</Box>
							</Skeleton>
							<Box
								style={descStyle}
							>
								Allocation
							</Box>
						</>
					</Flex>
				</Flex>
			</Flex>
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
			{defaults?.lockdropPairs?.map(p => <Card
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

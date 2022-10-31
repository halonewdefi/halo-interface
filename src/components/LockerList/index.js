import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Image, Skeleton } from '@chakra-ui/react'
import { defaults, prettifyNumber } from '../../common'
import { usePhase1allocation, useUniEthPrice, useUniLPTokenPrice, useERC20Balance,
	useUniV2Liquidity, useUnknownERC20Resolve, usePhase } from '../../hooks'
import { utils } from 'ethers'
import { Phase1LockModal } from '../Phase1LockModal'

const Card = (props) => {

	Card.propTypes = {
		p: PropTypes.object.isRequired,
		deposit: PropTypes.func.isRequired,
	}

	const allocation = usePhase1allocation()
	const t = useUniLPTokenPrice(props.p.address)
	const { data: p } = useUniEthPrice()
	const { data: b } = useERC20Balance(props.p.address, defaults.address.phase1)
	const [tvl, setTvl] = useState('loading')
	const phase = usePhase()

	const token0Resolved = useUnknownERC20Resolve(props.p.token0)
	const token1Resolved = useUnknownERC20Resolve(props.p.token1)
	const uniV2Liquidity = useUniV2Liquidity(
		props.p.address,
	)

	const tokeIconStyleMain = {
		h: 'auto',
		w: '24px',
	}

	const tokeIconStyleAlt = {
		h: 'auto',
		w: '16px',
	}

	const valuStyle = {
		display: 'flex',
		flexDirection: 'row',
		gridGap: '0.2rem',
		fontWeight: '600',
		minHeight: '24px',
	}

	const descStyle = {
		fontSize: '0.899rem',
		minHeight: '24px',
	}

	useEffect(() => {
		if (t && p && b) {
			setTvl(
				Number(utils.formatUnits(b, 18)) *
				(Number(utils.formatEther(t)) *
				Number(p.pairs?.[0]?.token0Price)),
			)
		}
		return () => setTvl('loading')
	}, [t, p, b])

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
			onClick={() => props.deposit(props.p)}
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
						src={`/svg/tokens/${props.p.token0}/index.svg`}
						{...tokeIconStyleMain}
					/>
					<Image
						src={`/svg/tokens/${props.p.token1}/index.svg`}
						{...tokeIconStyleMain}
					/>
				</Flex>
				<Box as='h4'>
					{props.p.pair}
				</Box>
			</Flex>

			<Flex
				flexDir='row'
			>
				<Flex
					gridGap='1.1rem'
				>
					<Flex
						flexDir='column'
					>
						<>
							<Skeleton
								isLoaded={tvl === 'loading' ? false : true }
								style={valuStyle}
							>
								{
									`$${prettifyNumber(tvl, 0, 2, 'US', 'compact')}`
								}
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
								isLoaded={allocation.data}
								style={valuStyle}
							>
								{allocation.data &&
									prettifyNumber(utils.formatEther(allocation.data), 0, 0, 'US', 'compact')
								}
								<Image
									{...tokeIconStyleAlt}
									src={`svg/tokens/${defaults.address.halo}/index.svg`}/>
							</Skeleton>
							<Box
								style={descStyle}
							>
								Allocation
							</Box>
						</>
					</Flex>

					{uniV2Liquidity.token0.gt(0) &&
						<Flex
							flexDir='column'
						>
							<>
								<Skeleton
									isLoaded={
										!(token0Resolved.isLoading && uniV2Liquidity.token0.gt(0))
									}
									style={valuStyle}
								>
									{token0Resolved.data &&
										prettifyNumber(
											utils.formatUnits(
												uniV2Liquidity.token0,
												token0Resolved.data?.decimals,
											),
											0, 0, 'US', 'compact')
									}
									<Image
										src={`/svg/tokens/${props.p.token0}/index.svg`}
										{...tokeIconStyleAlt}
									/>
								</Skeleton>
								<Box
									style={descStyle}
								>
									Deposited
								</Box>
							</>
						</Flex>
					}

					{uniV2Liquidity.token1.gt(0) &&
						<Flex
							flexDir='column'
						>
							<>
								<Skeleton
									isLoaded={
										!(token1Resolved.isLoading && uniV2Liquidity.token1.gt(0))
									}
									style={valuStyle}
								>
									{token0Resolved.data &&
										prettifyNumber(
											utils.formatUnits(
												uniV2Liquidity.token1,
												token1Resolved.data?.decimals,
											),
											0, 0, 'US', 'compact')
									}
									<Image
										src={`/svg/tokens/${props.p.token1}/index.svg`}
										{...tokeIconStyleAlt}
									/>
								</Skeleton>
								<Box
									style={descStyle}
								>
									Deposited
								</Box>
							</>
						</Flex>
					}
				</Flex>
			</Flex>
		</Flex>
	)
}

export const LockerList = (props) => {

	const [phase1LockModalOpen, setPhase1LockModalOpen] = useState(false)
	const [phase2LockModalOpen, setPhase2LockModalOpen] = useState(false)
	const [pair, setPair] = useState({})
	const phase = usePhase()

	const openLockModal = (p) => {
		if (p.phase === 1) setPhase1LockModalOpen(true)
		if (p.phase === 2) setPhase2LockModalOpen(true)
		setPair(p)
	}

	const closeLockModal = () => {
		setPhase1LockModalOpen(false)
		setPhase2LockModalOpen(false)
		setPair({})
	}

	const rowStyle = {
		flexDir:'row',
		flexWrap:'wrap',
		gridGap:'1.7rem',
		mb:'3rem',
	}

	return (
		<>
			{phase.which > 1 &&
				<>
					<Box as='h2'>Lockdrop Phase 2</Box>
					<Box as='div' textStyle='subheading'>Contribute protocol liquidity to earn.</Box>
					<Flex
						{...rowStyle}
						{...props}>
						{defaults
							?.lockdropPairs
							?.filter(p => p.phase === 2)
							.map(p => <Card
								p={p}
								key={p.address}
								deposit={openLockModal}
							/>)
						}
					</Flex>
					<Phase1LockModal
						p={pair}
						isOpen={phase1LockModalOpen}
						onClose={() => closeLockModal()}
					/>
				</>
			}
			<Box as='h2'>Lockdrop Phase 1 </Box>
			<Box as='div' textStyle='subheading'>Earn for bootstraping initial liquidity.</Box>
			<Flex
				{...rowStyle}
				mb='0'
				{...props}>
				{defaults
					?.lockdropPairs
					?.filter(p => p.phase === 1)
					.map(p => <Card
						p={p}
						key={p.address}
						deposit={openLockModal}
					/>)
				}
			</Flex>
			<Phase1LockModal
				p={pair}
				isOpen={phase1LockModalOpen}
				onClose={() => closeLockModal()}
			/>
		</>
	)
}

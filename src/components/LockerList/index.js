import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Image, Skeleton } from '@chakra-ui/react'
import { defaults, prettifyNumber } from '../../common'
import { usePhase1allocation, useUniEthPrice, useUniLPTokenPrice, useERC20Balance,
	useUniV2Liquidity, useUnknownERC20Resolve, usePhase, useAllocationForHalo,
	useAllocationForUSDC, usePhase2Position, useHaloPrice } from '../../hooks'
import { utils } from 'ethers'
import { Phase0SaleModal, Phase1LockModal, Phase2LockModal } from '../../components'

const Card = (props) => {

	Card.propTypes = {
		p: PropTypes.object.isRequired,
		deposit: PropTypes.func.isRequired,
	}

	const allocation = usePhase1allocation()
	const allocationForHalo = useAllocationForHalo()
	const allocationForUSDC = useAllocationForUSDC()
	const phase = usePhase()
	const t = useUniLPTokenPrice(props.p.address)
	const { data: p } = useUniEthPrice()
	const { data: bP1 } = useERC20Balance(props.p.address, defaults.address.phase1)
	const { data: bP2 } = useERC20Balance(props.p.token0, defaults.address.phase2)
	const { usdcDeposited: usdcDeposited } = useHaloPrice()
	const [tvl, setTvl] = useState('loading')

	const token0Resolved = useUnknownERC20Resolve(props.p.token0)
	const token1Resolved = useUnknownERC20Resolve(props.p.token1)
	const uniV2Liquidity = useUniV2Liquidity(
		props.p.address,
	)
	const phase2position = usePhase2Position(props.p)
	const haloPrice = useHaloPrice()

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
		if (t && p && bP1) {
			if (props.p.phase === 1) {
				setTvl(
					Number(utils.formatUnits(bP1, 18)) *
					(Number(utils.formatEther(t)) *
					Number(p.pairs?.[0]?.token0Price)),
				)
			}
			return () => setTvl('loading')
		}
	}, [t, p, bP1])

	useEffect(() => {
		if (haloPrice.data &&
			bP2) {
			if (props.p.phase === 2 &&
				props.p.pair === 'HALO') {
				setTvl(
					utils.formatEther(bP2) *
					haloPrice.data,
				)
			}
		}
	}, [
		bP2,
		haloPrice.data,
	])

	useEffect(() => {
		if (usdcDeposited.data &&
			token0Resolved.data) {
			if (props.p.phase === 2 &&
				props.p.pair !== 'HALO') {
				setTvl(
					Number(
						utils.formatUnits(
							usdcDeposited.data,
							token0Resolved.data.decimals,
						),
					),
				)
			}
		}
	}, [
		usdcDeposited.data,
		token0Resolved.data,
	])

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
					{props.p.token0 &&
						<Image
							src={`/svg/tokens/${props.p.token0}/index.svg`}
							layerStyle='tokenIcon'
						/>
					}
					{props.p.token1 &&
						<Image
							src={`/svg/tokens/${props.p.token1}/index.svg`}
							layerStyle='tokenIcon'
						/>
					}
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
								{phase.which === 0 &&
									<>
										Remaining
									</>
								}
								{phase.which > 0 &&
									<>
										TVL
									</>
								}
							</Box>
						</>
					</Flex>

					<Flex
						flexDir='column'
					>
						<>
							<Skeleton
								isLoaded={
									props.p.phase === 1 ? allocation.data :
										props.p.phase === 2 && props.p.pair === 'HALO' ? allocationForHalo.data :
											props.p.pair === 'USDC' ? allocationForUSDC.data :
												false
								}
								style={valuStyle}
							>
								{props.p.phase === 1 &&
									<>
										{allocation.data &&
											prettifyNumber(utils.formatEther(allocation.data), 0, 4, 'US', 'compact')
										}
									</>
								}
								{props.p.phase === 2 && props.p.pair === 'HALO' &&
									<>
										{allocationForHalo.data &&
											prettifyNumber(utils.formatEther(allocationForHalo.data), 0, 4, 'US', 'compact')
										}
									</>
								}
								{props.p.phase === 2 && props.p.pair === 'USDC' &&
									<>
										{allocationForUSDC.data &&
											prettifyNumber(utils.formatEther(allocationForUSDC.data), 0, 4, 'US', 'compact')
										}
									</>
								}
								<Image
									src={`svg/tokens/${defaults.address.halo}/index.svg`}
									layerStyle='tokenIconSmall'
								/>
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
										layerStyle='tokenIconSmall'
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
										layerStyle='tokenIconSmall'
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

					{props.p.phase === 2 &&
						phase2position.data?.[2].gt(0) &&
						<Flex
							flexDir='column'
						>
							<>
								<Skeleton
									isLoaded={
										!(token0Resolved.isLoading && phase2position.data[2].gt(0))
									}
									style={valuStyle}
								>
									{token0Resolved.data &&
										prettifyNumber(
											utils.formatUnits(
												phase2position.data[2],
												token0Resolved.data?.decimals,
											),
											0, 0, 'US', 'compact')
									}
									<Image
										src={`/svg/tokens/${props.p.token0}/index.svg`}
										layerStyle='tokenIconSmall'
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

	const [phase0SaleModalOpen, setPhase0SaleModalOpen] = useState(false)
	const [phase1LockModalOpen, setPhase1LockModalOpen] = useState(false)
	const [phase2LockModalOpen, setPhase2LockModalOpen] = useState(false)
	const [pair, setPair] = useState({})
	const phase = usePhase()

	const openLockModal = (p) => {
		if (p.phase === 0) setPhase0SaleModalOpen(true)
		if (p.phase === 1) setPhase1LockModalOpen(true)
		if (p.phase === 2) setPhase2LockModalOpen(true)
		setPair(p)
	}

	const closeLockModal = () => {
		setPhase0SaleModalOpen(false)
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
								key={p.pair}
								deposit={openLockModal}
							/>)
						}
					</Flex>
				</>
			}
			{phase.which > 0 &&
				<>
					<Box as='h2'>Lockdrop Phase 1</Box>
					<Box as='div' textStyle='subheading'>Earn for bootstraping initial liquidity.</Box>
					<Flex
						{...rowStyle}
						{...props}>
						{defaults
							?.lockdropPairs
							?.filter(p => p.phase === 1)
							.map(p => <Card
								p={p}
								key={p.pair}
								deposit={openLockModal}
							/>)
						}
					</Flex>
				</>
			}
			<Box as='h2'>Pre-sale Phase 0</Box>
			<Box as='div' textStyle='subheading'>Take little risk to get high rewards.</Box>
			<Flex
				{...rowStyle}
				{...props}>
				{defaults
					?.lockdropPairs
					?.filter(p => p.phase === 0)
					.map(p => <Card
						p={p}
						key={p.pair}
						deposit={openLockModal}
					/>)
				}
			</Flex>
			<Phase0SaleModal
				p={pair}
				isOpen={phase0SaleModalOpen}
				onClose={() => closeLockModal()}
			/>
			<Phase1LockModal
				p={pair}
				isOpen={phase1LockModalOpen}
				onClose={() => closeLockModal()}
			/>
			<Phase2LockModal
				p={pair}
				isOpen={phase2LockModalOpen}
				onClose={() => closeLockModal()}
			/>
		</>
	)
}

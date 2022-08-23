import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Image, Skeleton } from '@chakra-ui/react'
import { defaults, prettifyNumber } from '../../common'
import { usePhase1allocation, useUniEthPrice, useUniLPTokenPrice, useERC20Balance } from '../../hooks'
import { utils } from 'ethers'
import { LockModal } from '../LockModal'

const Card = (props) => {

	Card.propTypes = {
		p: PropTypes.object.isRequired,
		deposit: PropTypes.func.isRequired,
	}

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

	const allocation = usePhase1allocation()
	const t = useUniLPTokenPrice(props.p.address)
	const { data: p } = useUniEthPrice()
	const { data: b } = useERC20Balance(props.p.address, defaults.address.phase1)
	const [tvl, setTvl] = useState('loading')

	useEffect(() => {
		if (t && p && b) {
			setTvl(Number(utils.formatUnits(b, 18)) * (Number(utils.formatEther(t)) * Number(p.pairs?.[0]?.token0Price)))
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
						{...tokeIconStyle}
					/>
					<Image
						src={`/svg/tokens/${props.p.token1}/index.svg`}
						{...tokeIconStyle}
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
					gridGap='1.333rem'
				>
					<Flex
						flexDir='column'
					>
						<>
							<Skeleton
								isLoaded={tvl === 'loading' ? false : true }
							>
								<Box
									style={valuStyle}
								>
									{
										`$${prettifyNumber(tvl, 0, 2, 'US', 'compact')}`
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
									 src={`svg/tokens/${defaults.address.halo}/index.svg`}/>
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

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [pair, setPair] = useState({})

	const openLockModal = (p) => {
		setIsModalOpen(true)
		setPair(p)
	}

	const closeLockModal = () => {
		setIsModalOpen(false)
		setPair({})
	}

	return (
		<>
			<Flex
				flexDir='row'
				flexWrap='wrap'
				gridGap='1.7rem'
				{...props}>
				{defaults?.lockdropPairs?.map(p => <Card
					p={p}
					key={p.address}
					deposit={openLockModal}
				/>)
				}
			</Flex>
			<LockModal
				p={pair}
				isOpen={isModalOpen}
				onClose={() => closeLockModal()}
			/>
		</>
	)
}

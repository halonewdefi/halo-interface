import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
	Flex,
	Box,
	Image,
	Skeleton,
	useColorMode,
	Icon,
} from '@chakra-ui/react'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'
import { useLocalStorage } from 'react-use'
import { useWallet } from 'use-wallet'
import { isEven, prettifyAddress, prettifyNumber } from '../../common'
import Jazzicon from '@metamask/jazzicon'
import { defaults } from '../../common'
import { useAggregatedAccValue, useERC20Balance, usePhase } from '../../hooks'
import { utils, BigNumber } from 'ethers'

const Row = (props) => {

	Row.propTypes = {
		name: PropTypes.string,
		value: PropTypes.object,
		i: PropTypes.number.isRequired,
	}

	const { colorMode } = useColorMode()
	const filled = colorMode === 'light' ? 'bg.light.200' : 'bg.dark.200'
	const bold = { fontWeight: props.i === 0 && 'bold' }

	return (
		<Flex
			layerStyle='tokenAmountDepositedRow'
			background={isEven(props.i) && filled}
		>
			<Flex
				{...bold}
			>
				{props.name}
			</Flex>
			<Flex
				{...bold}
			>
				{props.value &&
					<>
						{
							prettifyNumber(
								utils.formatEther(
									props.value,
								),
								0, 5, 'US')
						}
					</>
				}
				<Image
					ml='5px'
					layerStyle='tokenIconSmall'
					src={`svg/tokens/${defaults.address.halo}/index.svg`}
				/>
			</Flex>
		</Flex>
	)
}

export const AccountOverview = (props) => {

	const wallet = useWallet()
	const prettyAccount = prettifyAddress(wallet?.account, 4)
	const ref = useRef()

	const accountValue = useAggregatedAccValue()
	const balance = useERC20Balance(defaults.address.halo)
	const phase = usePhase()
	const [asc, setAsc] = useLocalStorage('AccountValueOverviewAscendingOrder', false)

	const data = [
		{
			name: 'Account Balance',
			value: balance.data,
		},
		{
			name: 'Total Reward Phase 1',
			value: accountValue.phase1Total,
		},
		{
			name: 'Total Reward Phase 2',
			value: BigNumber.from(0),
		},
		{
			name: 'Total Reward Phase 3',
			value: BigNumber.from(0),
		},
	]

	const descStyle = {
		fontWeight: '600',
		mb: '0',
	}

	useEffect(() => {
		if (wallet.account !== null) {
			ref.current.appendChild(
				Jazzicon(86, parseInt(wallet?.account?.slice(2, 10), 16)),
			).style.borderRadius = '0.34rem'
		}
		return () => {
			if (wallet.account) {
				if (
					ref.current !== null &&
					ref.current.getElementsByTagName('div')[0]) {
					ref.current.getElementsByTagName('div')[0].remove()
				}
			}
		}
	}, [wallet.account])

	return (
		<Flex
			flexDir='row'
			w='100%'
			p='2rem 0 2rem 0'
			alignItems='flex-start'
			flexWrap={{ base: 'wrap', md: 'nowrap' }}
		>
			<Flex
				width='100%'
				flexDir='row-reverse'
				justifyContent='left'
				gap='16px'
				mb={{ base: '1.34rem', md: '' }}
			>
				<Flex
					flexDir='column'
				>
					<Skeleton
						isLoaded={!!wallet.account}
					>
						<Box
							height='27px'
						>
							<Box
								as='h4'
								paddingTop='0'
								lineHeight='27px'
								{...descStyle}>
								{prettyAccount}
							</Box>
						</Box>
					</Skeleton>
					<Flex
						flexDir='row'
						gap='.2rem'
					>
						<Skeleton
							isLoaded={balance.data &&
								accountValue.phase1Total &&
								!accountValue.isLoading
							}
						>
							<Box
								lineHeight='1'
								fontSize='2.9rem'
								wordBreak='break-all'
							>
								{prettifyNumber(
									utils.formatEther(accountValue.total),
									2,
									2,
									'US',
								)}
							</Box>
						</Skeleton>
						<Image
							src={`svg/tokens/${defaults.address.halo}/index.svg`}
							layerStyle='tokenIconLarge'
						/>
					</Flex>
						Total Account Value
				</Flex>
				<Skeleton
					isLoaded={!!wallet.account}
				>
					<Flex
						height='97.4px'
						width='86px'
					>
						<Flex
							height='97.4px'
							alignItems='center'
							ref={ref}
						/>
					</Flex>
				</Skeleton>
			</Flex>
			<Flex
				width={{ base: '100%', md: '66%' }}
				flexFlow='column'
				justifyContent='space-between'
			>
				<Flex>
					<Box
						as='h4'
						textStyle='heading'
					>
						Overview
					</Box>
					<Icon
						scale='1.1'
						as={!asc ? TiArrowSortedDown : TiArrowSortedUp}
						cursor='pointer'
						onClick={() => setAsc(!asc)}
					/>
				</Flex>
				<Flex
					width='100%'
					flexDir='column'
				>
					<Skeleton
						flexFlow='column'
						mb={{ sm: '', md: '1.34rem' }}
						gridGap='0.35rem'
						isLoaded={!accountValue?.isLoading}
					>
						{data
							.filter((n, i) => {
								if (phase.which === 1) return i <= 1
								if (phase.which === 2) return i <= 2
								if (phase.which === 3) return i <= 3
							})
							.sort((a, b) => {
								if (a.value && b.value) {
									if (asc) return a.value.sub(b.value)
									if (!asc) return b.value.sub(a.value)
								}
							})
							.map((n, i) => <Row
								name={n.name}
								value={n.value}
								i={i}
								key={i}
							/>,
							)
						}
					</Skeleton>
				</Flex>
			</Flex>
		</Flex>
	)
}

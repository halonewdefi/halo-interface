import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
	Modal,
	ModalHeader,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Box,
	Flex,
	InputGroup,
	Input,
	Image,
	InputRightElement,
	Spinner,
	Button,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
	useColorModeValue,
	Skeleton,
	Switch,
	useColorMode,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { defaults, handleTokenInput, approveERC20ToSpend, prettifyNumber, prettifyCurrency } from '../../common'
import { deposit, withdraw } from '../../common/phase1'
import { useUnknownERC20Resolve, useERC20Allowance, useUniV2TokenQuantity, useERC20Balance,
	useUniV2LPTokenQuantity, usePreQuoteHalo, usePhase1Position, useAggregatedAccValue, usePhase, useUniV2Liquidity } from '../../hooks'

export const Phase0SaleModal = (props) => {
	Phase0SaleModal.propTypes = {
		p: PropTypes.object.isRequired,
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
	}

	const token0Resolved = useUnknownERC20Resolve(props.p.token0)
	const token1Resolved = useUnknownERC20Resolve(props.p.token1)
	const token0Allowance = useERC20Allowance(props.p.token0, defaults.address.phase1)
	const token1Allowance = useERC20Allowance(props.p.token1, defaults.address.phase1)
	const token0Balance = useERC20Balance(props.p.token0)
	const token1Balance = useERC20Balance(props.p.token1)
	const lpTokenBalance = useERC20Balance(props.p.address)

	const phase = usePhase()
	const phase1position = usePhase1Position(props.p.address)

	const [token0Amount, setToken0Amount] = useState('')
	const [token0Value, setToken0Value] = useState('')
	const [token1Amount, setToken1Amount] = useState('')
	const [token1Value, setToken1Value] = useState('')

	const aggregatedAccValue = useAggregatedAccValue()

	const uniV2TokenQuantity = useUniV2TokenQuantity(
		props.p.address,
		token0Value, token1Value,
		token0Resolved?.data?.decimals,
		token1Resolved?.data?.decimals,
	)
	const uniV2LPTokenQuantity = useUniV2LPTokenQuantity(
		props.p.address,
		uniV2TokenQuantity.token0Quantity,
		uniV2TokenQuantity.token1Quantity,
	)
	const uniV2Liquidity = useUniV2Liquidity(
		props.p.address,
	)

	const [ogLevel, setOgLevel] = useState(0)
	const [lockPeriodInDays, setLockPeriodInDays] = useState(7776000)
	const [ratio, setRatio] = useState(ethers.utils.parseEther('0.003'))
	const [working, setWorking] = useState(false)
	const wallet = useWallet()
	const { colorMode } = useColorMode()

	const groupStyle = {
		height: 'auto',
		size: 'lg',
	}

	const inputStyle = {
		variant: 'blank',
		flex: '1',
		placeholder: '0.0',
		paddingRight: '6.4rem',
	}

	const rightElementStyle = {
		width: 'auto',
		display: 'flex',
		marginRight: '15px',
		alignItems: 'center',
	}

	const extrasStyle = {
		color: useColorModeValue('type.body.dark', 'type.body.light'),
		p: '3px',
		alignItems: 'center',
	}

	const ncButtonProps = {
		variant: 'outline',
		size:'sm',
	}

	const markLabelStyle = {
		mt: '2',
		ml: '-3.5',
		fontSize: 'sm',
		textAlign: 'center',
		cursor: (phase.which === 0) ? 'pointer' : '',
		pointerEvents: (phase.which === 0) ? 'all !important' : '',
	}

	useEffect(() => {
		if (
			uniV2TokenQuantity.token0Quantity &&
			uniV2TokenQuantity.token1Quantity &&
			token0Value) {
			if (token0Value.eq(uniV2TokenQuantity.token0Quantity)) {
				uniV2TokenQuantity.setVsync(true)
				setToken1Amount(ethers.utils.formatUnits(uniV2TokenQuantity.token1Quantity, token1Resolved?.data?.decimals))
				setToken1Value(uniV2TokenQuantity?.token1Quantity)
			}
		}
	}, [
		uniV2TokenQuantity.token1Quantity,
		uniV2TokenQuantity.token1Price,
	])

	useEffect(() => {
		if (uniV2TokenQuantity.token0Quantity &&
			uniV2TokenQuantity.token1Quantity &&
			token1Value) {
			if (token1Value.eq(uniV2TokenQuantity.token1Quantity)) {
				uniV2TokenQuantity.setVsync(true)
				setToken0Amount(ethers.utils.formatUnits(uniV2TokenQuantity.token0Quantity, token0Resolved?.data?.decimals))
				setToken0Value(uniV2TokenQuantity?.token0Quantity)
			}
		}
	}, [
		uniV2TokenQuantity.token0Quantity,
		uniV2TokenQuantity.token0Price,
	])

	useEffect(() => {
		if(props.p.pair) {
			if (ogLevel === 0) {
				setLockPeriodInDays(7776000)
				setRatio(0.003)
			}
			if (ogLevel === 1) {
				setLockPeriodInDays(15552000)
				setRatio(0.0025)
			}
			if (ogLevel === 2) {
				setLockPeriodInDays(31536000)
				setRatio(0.002)
			}
		}
	}, [])

	useEffect(() => {
		if (props.p.pair) {
			if (phase1position.data) {
				if (phase1position.data?.[1]?.toNumber() <= 4) {
					setOgLevel(0)
				}
				if (phase1position.data?.[1]?.toNumber() === 9) {
					setOgLevel(1)
				}
				if (phase1position.data?.[1]?.toNumber() === 19) {
					setOgLevel(2)
				}
			}
		}
	}, [
		phase1position.data?.[1],
	])

	useEffect(() => {
		return () => {
			setToken0Amount('')
			setToken0Value('')
			setToken1Amount('')
			setToken1Value('')
		}
	}, [
		props.p,
	])

	return (
		<>
			<Modal
				onClose={props.onClose}
				isOpen={props.isOpen}
				autoFocus={false}
				scrollBehavior='inside'
				size='sm'
				motionPreset={{ base: 'slideInBottom', md: '' }}
			>
				<ModalOverlay />
				<ModalContent overflow='hidden'>
					<ModalHeader>{`${props.p.pair}`}</ModalHeader>
					<ModalCloseButton top={defaults.layout.modal.closeButton.top} />
					<ModalBody minH={defaults.layout.modal.body.minH}>
						<Box
							p='3px 1.5rem 1.5rem'
						>
							{phase.which === 0 &&
								<>
									<Box
										as='h4'
										textStyle='heading'
									>
										Amount
									</Box>
									<Flex
										flexDir='column'
										flexWrap='wrap'
										gap='9px'
										mb='1rem'
									>
										<InputGroup {...groupStyle}>
											<Input
												{...inputStyle}
												value={token0Amount}
												onChange={(e) => {
													uniV2TokenQuantity.setVsync(false)
													handleTokenInput(
														setToken0Amount,
														setToken0Value,
														e,
														token0Resolved,
													)
												}}
											/>
											<InputRightElement {...rightElementStyle}>
												{(token0Resolved?.isLoading || uniV2Liquidity.isLoading) &&
											<Spinner />
												}
												{(!token0Resolved?.isLoading && !uniV2Liquidity.isLoading) &&
											<>
												<Image
													layerStyle='tokenImage'
													src={token0Resolved?.data?.logoURI}
												/>
												<Box layerStyle='tokenSymbol'>
													{token0Resolved?.data?.symbol}
												</Box>
											</>
												}
											</InputRightElement>
										</InputGroup>
									</Flex>
								</>
							}
							{phase.which !== 0 &&
								<Flex
									mb='1.34rem'
									layerStyle='modalNote'
								>
									<Box
										as='h4'
										m='0'
										p='0'
										textStyle='heading'
									>
										Phase 0 is over
									</Box>
									<Box
										as='p'
										ml='4px'
										textAlign='justify'
									>
										This phase has ended.
										There will be no more sells.
										Below is current
										summary of your position.
									</Box>
								</Flex>
							}
							<Box
								as='h4'
								textStyle='heading'
								margin='0px 0 -2px 4px'
							>
								OG Level
							</Box>
							<Flex
								flexFlow='column'
								minH='45px'
								padding='0px 18px 1.5px'
								marginBottom='3.5rem'
								opacity='1'
								cursor={(phase.which === 0) ? 'pointer' : 'not-allowed'}
							>
								<Slider
									defaultValue={0}
									min={0}
									max={2}
									disabled={(phase.which === 0 ? false : true)}
									_disabled={{
										pointerEvents: 'none',
										opacity: '1',
									}}
									step={1}
									value={ratio}
									onChange={(n) => setOgLevel(n)}
								>
									<Box
										mt='15px'
										p='0 10px'
									>
										<SliderMark
											value={0}
											opacity={(phase.which === 0) ? '1' : '0.6'}
											onClick={() => { setOgLevel(0) }}
											{...markLabelStyle}>
											Level<br/>1
										</SliderMark>
										<SliderMark
											value={1}
											opacity={(phase.which === 1) ? '1' : '0.6'}
											onClick={() => { setOgLevel(1) }}
											{...markLabelStyle}
										>
											Level<br/>2
										</SliderMark>
										<SliderMark
											value={2}
											opacity={(phase.which === 1) ? '1' : '0.6'}
											onClick={() => { setOgLevel(2) }}
											{...markLabelStyle}
										>
											Level<br/>3
										</SliderMark>
									</Box>
									<SliderTrack bg='red.100'>
										<Box position='relative' right={10} />
										<SliderFilledTrack bg='accent.dark.150' />
									</SliderTrack>
									<SliderThumb boxSize={6} />
								</Slider>
							</Flex>
							<Flex
								flexDir='row'
							>
								<Box
									as='h4'
									mb='1rem'
									w='48%'
									textStyle='heading'
								>
									RATIO
									<Flex
										{...extrasStyle}
									>
										<>
											{prettifyCurrency(0.0003, 0, 4, 'ETH')}
										</>
									</Flex>
								</Box>
								<Box
									as='h4'
									mb='1rem'
									textStyle='heading'
								>
									Total TBP
									<Flex
										{...extrasStyle}
									>

									</Flex>
								</Box>
							</Flex>
							<Box
								as='h4'
								textStyle='heading'
							>
								Acquired
							</Box>
							<Skeleton
								flexFlow='column'
								marginBottom='1.34rem'
								gridGap='0.35rem'
								isLoaded={(!token0Resolved.isLoading && !uniV2Liquidity.isLoading)}
							>
								<Flex
									layerStyle='tokenAmountDepositedRow'
									background={colorMode === 'light' ? 'bg.light.200' : 'bg.dark.200'}
								>
									<Flex>
										<Image
											layerStyle='tokenImage'
											src={token0Resolved?.data?.logoURI}
										/>
										<Box layerStyle='tokenSymbol'>
											{token0Resolved?.data?.symbol}
										</Box>
									</Flex>
									<Flex>
										{token0Resolved.data &&
											prettifyNumber(
												ethers.utils.formatUnits(
													uniV2Liquidity.token0,
													token0Resolved.data?.decimals,
												),
												2, 10, 'US')
										}
									</Flex>
								</Flex>
								<Flex
									layerStyle='tokenAmountDepositedRow'
								>
									<Flex>
										<Image
											layerStyle='tokenImage'
											src={token1Resolved?.data?.logoURI}
										/>
										<Box layerStyle='tokenSymbol'>
											{token1Resolved?.data?.symbol}
										</Box>
									</Flex>
									<Flex>
										{token1Resolved.data &&
											prettifyNumber(
												ethers.utils.formatUnits(
													uniV2Liquidity.token0,
													token0Resolved.data?.decimals,
												),
												2, 2, 'US')
										}
									</Flex>
								</Flex>
							</Skeleton>
							{(
								(token0Resolved?.data && token1Resolved?.data) &&
								token0Value && token1Value &&
									(
										((token0Allowance?.data?.lte(0)) ||
										(token1Allowance?.data?.lte(0))) ||
										((token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval))) ||
										(token1Allowance?.data?.lt(token1Value) && token1Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval))))
									)
							 ) &&
								<Flex
									mb='1rem'
									layerStyle='modalNote'
								>
									<Box
										as='h4'
										m='0'
										p='0'
										textStyle='heading'
									>
										{`Allow ${token0Allowance?.data?.lte(0) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ||
										  token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ?
											token0Resolved?.data?.symbol :
											token1Resolved?.data?.symbol}
										`}
									</Box>
									<Box
										as='p'
										ml='4px'
									>
										{`In order to be able to lock, it's neccesary to allow interaction with ${token0Allowance?.data?.lte(0) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ||
										  token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ?
											token0Resolved?.data?.symbol :
											token1Resolved?.data?.symbol} token.`}
									</Box>
									<Button
										w='100%'
										variant='solid'
										isLoading={working}
										onClick={() => {
											setWorking(true)
											const provider = new ethers.providers.Web3Provider(wallet.ethereum)
											approveERC20ToSpend(
												token0Allowance?.data?.lte(0) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ||
												token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ? token0Resolved?.data?.address : token1Resolved?.data?.address,
												defaults.address.phase1,
												defaults.network.erc20.maxApproval,
												provider,
											)
												.then((tx) => {
													tx.wait(defaults.network.tx.confirmations)
														.then(() => {
															token0Allowance?.refetch()
															token1Allowance?.refetch()
															setWorking(false)
														})
														.catch(() => setWorking(false))
												})
												.catch(() => setWorking(false))
										}}
									>
										<Image
											layerStyle='tokenImage'
											src={
												token0Allowance?.data?.lte(0) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ||
												token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ?
													token0Resolved?.data?.logoURI :
													token1Resolved?.data?.logoURI
											}
										/>
											Allow
										<Box
											ml='5px'
											layerStyle='tokenSymbol'
										>
											{
												token0Allowance?.data?.lte(0) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ||
												token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ?
													token0Resolved?.data?.symbol :
													token1Resolved?.data?.symbol
											}
										</Box>
									</Button>
								</Flex>
							}
							{phase.which === 0 &&
								<Button
									w='100%'
									loadingText={ 'Acquiring tokens'}
								>
									{'Acquire tokens'}
								</Button>
							}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
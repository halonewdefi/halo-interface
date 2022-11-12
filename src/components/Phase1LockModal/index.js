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
import { defaults, handleTokenInput, approveERC20ToSpend, prettifyNumber } from '../../common'
import { deposit, withdraw } from '../../common/phase1'
import { useUnknownERC20Resolve, useERC20Allowance, useUniV2TokenQuantity, useERC20Balance,
	useUniV2LPTokenQuantity, usePreQuoteHalo, usePhase1Position, useAggregatedAccValue, usePhase, useUniV2Liquidity } from '../../hooks'

export const Phase1LockModal = (props) => {
	Phase1LockModal.propTypes = {
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
	const [doWithdrawal, setDoWithdrawal] = useState(false)

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

	const [lockPeriod, setLockPeriod] = useState(0)
	const [lockPeriodInDays, setLockPeriodInDays] = useState(7776000)
	const [multiplier, setMultiplier] = useState(4)
	const preQuoteHalo = usePreQuoteHalo(
		uniV2LPTokenQuantity.lpTokenQuantity,
		multiplier,
		props.p.address,
		doWithdrawal,
	)
	const [working, setWorking] = useState(false)
	const wallet = useWallet()
	const { colorMode } = useColorMode()

	const headingStyle = {
		marginLeft: '4px',
	}

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

	const tokenImageStyle = {
		width: '24px',
		height: '24px',
		borderRadius: '50%',
		mr: '5px',
	}

	const extrasStyle = {
		color: useColorModeValue('type.body.dark', 'type.body.light'),
		p: '3px',
	}

	const tokenSymbolStyle = {
		fontWeight: 'bold',
		textTransform: 'capitalize',
	}

	const ncGroupStyle = {
		flexDir: 'row',
		justifyContent: 'right',
		gap: '6px',
	}

	const ncButtonStyle = {
		variant: 'outline',
		size:'sm',
	}

	const noteStyle = {
		flexDir: 'column',
		flexWrap: 'wrap',
		mb: '1.34rem',
		bg: '#7D786E26',
		p: '1rem',
		borderRadius: '0.5rem',
		gap: '0.3rem',
	}

	const markLabelStyle = {
		mt: '2',
		ml: '-3.5',
		fontSize: 'sm',
		textAlign: 'center',
		cursor: (!doWithdrawal && phase.which === 1) ? 'pointer' : '',
		pointerEvents: (!doWithdrawal && phase.which === 1) ? 'all !important' : '',
	}

	const depositedRowStyle = {
		justifyContent: 'space-between',
		borderRadius: '0.34rem',
		padding: '4px 5px',
	}

	const lock = () => {
		try {
			if (
				(uniV2TokenQuantity.token0Quantity?.gt(0) && uniV2TokenQuantity.token1Quantity?.gt(0)) &&
				(token0Balance.data?.gte(uniV2TokenQuantity.token0Quantity)) &&
				(token1Balance.data?.gte(uniV2TokenQuantity.token1Quantity)) &&
				!(working)
			) {
				setWorking(true)
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				deposit(
					props.p.address,
					uniV2TokenQuantity.token0Quantity,
					uniV2TokenQuantity.token1Quantity,
					lockPeriodInDays,
					provider,
				)
					.then((tx) => {
						tx.wait(
							defaults.network.tx.confirmations,
						).then(() => {
							setWorking(false)
							if (phase.which === 1) phase1position.refetch()
							preQuoteHalo.refetchTotalWeightOfLockedPositions()
							token0Balance.refetch()
							token1Balance.refetch()
							aggregatedAccValue.refetch()
						})
					})
					.catch(error => {
						setWorking(false)
						console.log(error)
					})
			}
		}
		catch (error) {
			console.log(error)
		}
	}

	const withdrawal = () => {
		try {
			if (
				(doWithdrawal) &&
				(uniV2LPTokenQuantity.lpTokenQuantity) &&
				(phase1position?.data[2].gte(uniV2LPTokenQuantity.lpTokenQuantity)) &&
				!(working)
			) {
				setWorking(true)
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				withdraw(
					props.p.address,
					uniV2LPTokenQuantity.lpTokenQuantity,
					provider,
				)
					.then((tx) => {
						tx.wait(
							defaults.network.tx.confirmations,
						).then(() => {
							setWorking(false)
							if (phase.which === 1) phase1position.refetch()
							preQuoteHalo.refetchTotalWeightOfLockedPositions()
							token0Balance.refetch()
							token1Balance.refetch()
							aggregatedAccValue.refetch()
						})
					})
					.catch(error => {
						setWorking(false)
						console.log(error)
					})
			}
		}
		catch (error) {
			console.log(error)
		}
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
			if (lockPeriod === 0) {
				setLockPeriodInDays(7776000)
				setMultiplier(4)
			}
			if (lockPeriod === 1) {
				setLockPeriodInDays(15552000)
				setMultiplier(9)
			}
			if (lockPeriod === 2) {
				setLockPeriodInDays(31536000)
				setMultiplier(19)
			}
		}
	}, [lockPeriod])

	useEffect(() => {
		if (props.p.pair) {
			if (phase1position.data) {
				if (phase1position.data?.[1]?.toNumber() <= 4) {
					setLockPeriod(0)
				}
				if (phase1position.data?.[1]?.toNumber() === 9) {
					setLockPeriod(1)
				}
				if (phase1position.data?.[1]?.toNumber() === 19) {
					setLockPeriod(2)
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
							{phase.which === 1 &&
								<>
									<Box
										as='h4'
										{...headingStyle}
									>
										Amounts
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
													{...tokenImageStyle}
													src={token0Resolved?.data?.logoURI}
												/>
												<Box {...tokenSymbolStyle}>
													{token0Resolved?.data?.symbol}
												</Box>
											</>
												}
											</InputRightElement>
										</InputGroup>
										<Flex
											{...ncGroupStyle}
										>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0.div(100).mul(25) :
																	token0Balance?.data?.div(100).mul(25),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0.div(100).mul(25) :
																token0Balance?.data?.div(100).mul(25),
														)
													}
												}}
											>25%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0.div(100).mul(50) :
																	token0Balance?.data?.div(100).mul(50),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0.div(100).mul(50) :
																token0Balance?.data?.div(100).mul(50),
														)
													}
												}}
											>50%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0.div(100).mul(75) :
																	token0Balance?.data?.div(100).mul(75),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0.div(100).mul(75) :
																token0Balance?.data?.div(100).mul(75),
														)
													}
												}}
											>75%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0 :
																	token0Balance?.data,
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token0 :
																token0Balance?.data,
														)
													}
												}}
											>Max</Button>
										</Flex>

										<InputGroup {...groupStyle}>
											<Input
												{...inputStyle}
												value={token1Amount}
												onChange={(e) => {
													uniV2TokenQuantity.setVsync(false)
													handleTokenInput(
														setToken1Amount,
														setToken1Value,
														e,
														token1Resolved,
													)
												}}
											/>
											<InputRightElement {...rightElementStyle}>
												{(token1Resolved?.isLoading || uniV2Liquidity?.isLoading) &&
											<Spinner />
												}
												{(!token1Resolved?.isLoading && !uniV2Liquidity?.isLoading) &&
											<>
												<Image
													{...tokenImageStyle}
													src={token1Resolved?.data?.logoURI}
												/>
												<Box {...tokenSymbolStyle}>
													{token1Resolved?.data?.symbol}
												</Box>
											</>
												}
											</InputRightElement>
										</InputGroup>
										<Flex
											{...ncGroupStyle}
										>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken1Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1.div(100).mul(25) :
																	token1Balance?.data?.div(100).mul(25),
																token1Resolved?.data?.decimals,
															),
														)
														setToken1Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1.div(100).mul(25) :
																token1Balance?.data?.div(100).mul(25),
														)
													}
												}}
											>25%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken1Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1.div(100).mul(50) :
																	token1Balance?.data?.div(100).mul(50),
																token1Resolved?.data?.decimals,
															),
														)
														setToken1Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1.div(100).mul(50) :
																token1Balance?.data?.div(100).mul(50),
														)
													}
												}}
											>50%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken1Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1.div(100).mul(75) :
																	token1Balance?.data?.div(100).mul(75),
																token1Resolved?.data?.decimals,
															),
														)
														setToken1Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1.div(100).mul(75) :
																token1Balance?.data?.div(100).mul(75),
														)
													}
												}}
											>75%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														uniV2TokenQuantity.setVsync(false)
														setToken1Amount(
															ethers.utils.formatUnits(
																doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1 :
																	token1Balance?.data,
																token1Resolved?.data?.decimals,
															),
														)
														setToken1Value(
															doWithdrawal && phase.which === 1 ? uniV2Liquidity?.token1 :
																token1Balance?.data,
														)
													}
												}}
											>Max</Button>
										</Flex>
									</Flex>
									<Flex
										flexFlow='column'
										marginBottom='2rem'
									>
										<Switch
											variant='wide'
											size='lg'
											isChecked={doWithdrawal}
											onChange={() => setDoWithdrawal(!doWithdrawal)}
										>
											<Box
												w='50%'
												as='span'
												textAlign='center'
											>
												Deposit
											</Box>
											<Box
												w='50%'
												as='span'
												textAlign='center'
											>
												Withdraw
											</Box>
										</Switch>
									</Flex>
								</>
							}
							{phase.which !== 1 &&
								<Flex
									mb='1.34rem'
									{...noteStyle}
								>
									<Box
										as='h4'
										m='0'
										p='0'
										{...headingStyle}
									>
										Phase 1 is over
									</Box>
									<Box
										as='p'
										ml='4px'
									>
										Lock period has been initiated.
										Deposits or&nbsp;withdrawals are&nbsp;not possible anymore. Below is current
										summary of your position.
									</Box>
								</Flex>
							}
							<Box
								as='h4'
								{...headingStyle}
								margin='0px 0 -2px 4px'
							>
								Lock Period
							</Box>
							<Flex
								flexFlow='column'
								minH='45px'
								padding='0px 18px 1.5px'
								marginBottom='3.5rem'
								opacity='1'
								cursor={(!doWithdrawal && phase.which === 1) ? 'pointer' : 'not-allowed'}
							>
								<Slider
									defaultValue={0}
									min={0}
									max={2}
									disabled={(!doWithdrawal && phase.which === 1) ? false : true}
									_disabled={{
										pointerEvents: 'none',
										opacity: '1',
									}}
									step={1}
									value={lockPeriod}
									onChange={(n) => setLockPeriod(n)}
								>
									<Box
										mt='15px'
										p='0 10px'
									>
										<SliderMark
											value={0}
											opacity={(!doWithdrawal && phase.which === 1) ? '' :
												(lockPeriod === 0) ? '1' : '0.6'}
											onClick={() => { if (!doWithdrawal) { setLockPeriod(0) }}}
											{...markLabelStyle}>
											90<br/>days
										</SliderMark>
										<SliderMark
											value={1}
											opacity={(!doWithdrawal && phase.which === 1) ? '' :
												(lockPeriod === 1) ? '1' : '0.6'}
											onClick={() => { if (!doWithdrawal) { setLockPeriod(1) }}}
											{...markLabelStyle}
										>
											180<br/>days
										</SliderMark>
										<SliderMark
											value={2}
											opacity={(!doWithdrawal && phase.which === 1) ? '' :
												(lockPeriod === 2) ? '1' : '0.6'}
											onClick={() => { if (!doWithdrawal) { setLockPeriod(2) }}}
											{...markLabelStyle}
										>
											365<br/>days
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
									{...headingStyle}
								>
									REWARD
									<Flex
										{...extrasStyle}
									>
										<Skeleton
											display='flex'
											flexDir='row'
											gap='0.2rem'
											minW='50%'
											isLoaded={
												!!(preQuoteHalo.preQuote && ((preQuoteHalo.preQuote > 0 && uniV2LPTokenQuantity.lpTokenQuantity >= 0) ||
												(doWithdrawal && preQuoteHalo.preQuote == 0) ||
												(preQuoteHalo.preQuote && phase1position.data?.[1] == 0)))
											}>
											{preQuoteHalo.preQuote &&
													<>
														{
															<>
																{prettifyNumber(ethers.utils.formatEther(preQuoteHalo.preQuote), 0, 4, 'US', 'compact')}
															</>
														}
													</>
											}
											<Image
												h='auto'
												w='24px'
												src={`svg/tokens/${defaults.address.halo}/index.svg`}/>
										</Skeleton>
									</Flex>
								</Box>
								<Box
									as='h4'
									mb='1rem'
									{...headingStyle}
								>
									Multiplier
									<Flex
										{...extrasStyle}
									>
										{`${multiplier}x`}
									</Flex>
								</Box>
							</Flex>
							<Box
								as='h4'
								{...headingStyle}
							>
								Deposited
							</Box>
							<Skeleton
								flexFlow='column'
								marginBottom='1.34rem'
								gridGap='0.35rem'
								isLoaded={(!token0Resolved.isLoading && !uniV2Liquidity.isLoading)}
							>
								<Flex
									{...depositedRowStyle}
									background={colorMode === 'light' ? '#eddcbc' : '#212121'}
								>
									<Flex>
										<Image
											{...tokenImageStyle}
											src={token0Resolved?.data?.logoURI}
										/>
										<Box {...tokenSymbolStyle}>
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
									{...depositedRowStyle}
								>
									<Flex>
										<Image
											{...tokenImageStyle}
											src={token1Resolved?.data?.logoURI}
										/>
										<Box {...tokenSymbolStyle}>
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
									{...noteStyle}
								>
									<Box
										as='h4'
										m='0'
										p='0'
										{...headingStyle}
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
											{...tokenImageStyle}
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
											{...tokenSymbolStyle}
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
							{phase.which === 1 &&
								<Button
									w='100%'
									isLoading={(token0Allowance?.data?.gt(0) &&
										token0Allowance?.data?.gt(token0Value ? token0Value : 0)) ||
										(token1Allowance?.data?.gt(0) &&
										token1Allowance?.data?.gt(token1Value ? token1Value : 0)) ? working : false}
									loadingText={ !doWithdrawal ? 'Depositing' : 'Withdrawing'}
									disabled={!(uniV2TokenQuantity.token0Quantity &&
										uniV2TokenQuantity.token1Quantity &&
										uniV2LPTokenQuantity.lpTokenQuantity &&
										token1Balance.data &&
										token1Balance.data &&
										lpTokenBalance.data &&
										token0Value &&
										token1Value &&
										token0Amount &&
										token1Amount) ||
										(!(uniV2TokenQuantity.token0Quantity?.gt(0) &&
										uniV2TokenQuantity.token1Quantity?.gt(0) &&
										uniV2LPTokenQuantity.lpTokenQuantity.gt(0) &&
										(token0Value?.lte(token0Balance.data) &&
										token1Value.lte(token1Balance.data)) ||
										(uniV2LPTokenQuantity.lpTokenQuantity.lte(lpTokenBalance.data)) &&
									(token0Allowance?.data?.gt(0) &&
										token0Allowance?.data?.gt(token0Value)) &&
									(token1Allowance?.data?.gt(0) &&
										token1Allowance?.data?.gt(token1Value)) &&
									!(working)))}
									onClick={() => {
										if (!doWithdrawal) {
											lock()
										}
										else {
											withdrawal()
										}
									}}
								>
									{`${doWithdrawal ? 'Withdraw' : 'Deposit' } assets`}
								</Button>
							}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
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
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
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
import { ChevronDownIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { defaults, handleTokenInput, approveERC20ToSpend, prettifyNumber, depositToPhase2 } from '../../common'
import { depositStable, withdrawStable } from '../../common/phase2'
import { useUnknownERC20Resolve, useERC20Allowance, useERC20Balance,
	useAggregatedAccValue, usePhase, usePhase2Position, useQuoteHalo } from '../../hooks'

const Phase1PoolItem = (props) => {

	Phase1PoolItem.propTypes = {
		p: PropTypes.object.isRequired,
		setFromPhase1Pair: PropTypes.func.isRequired,
	}

	const halo = useQuoteHalo(props.p.address)

	return <>
		{halo?.data?.gt(0) &&
			<MenuItem
				flexDir='column'
				onClick={() => props.setFromPhase1Pair(props.p)}
			>
				<Flex
					gap='.34rem'
				>
					<Flex
						gap='.24rem'
					>
						{props.p.token0 &&
							<Image
								src={`/svg/tokens/${props.p.token0}/index.svg`}
								layerStyle='tokenIconSmall'
							/>
						}
						{props.p.token1 &&
							<Image
								src={`/svg/tokens/${props.p.token1}/index.svg`}
								layerStyle='tokenIconSmall'
							/>
						}
					</Flex>
					<Flex as='span'>
						{props.p.pair}
					</Flex>
				</Flex>
				<Flex>
					{halo.data &&
						<>
							{
								<>
									{`${prettifyNumber(ethers.utils.formatEther(halo.data), 0, 5, 'US')}`}
									<Image
										marginInlineStart='.14rem'
										src={`svg/tokens/${defaults.address.halo}/index.svg`}
										layerStyle='tokenIconSmall'
									/>
								</>
							}
						</>
					}
				</Flex>
			</MenuItem>
		}
	</>
}

export const Phase2LockModal = (props) => {
	Phase2LockModal.propTypes = {
		p: PropTypes.object.isRequired,
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
	}

	const token0Resolved = useUnknownERC20Resolve(props.p.token0)
	const token0Allowance = useERC20Allowance(props.p.token0, defaults.address.phase2)
	const token0Balance = useERC20Balance(props.p.token0)

	const phase = usePhase()
	const phase2position = usePhase2Position(props.p)
	const [token0Amount, setToken0Amount] = useState('')
	const [token0Value, setToken0Value] = useState('')
	const [fromPhase1Pair, setFromPhase1Pair] = useState({})
	const fromPhase1Value = useQuoteHalo(fromPhase1Pair.address)
	const [doWithdrawal, setDoWithdrawal] = useState(false)

	const aggregatedAccValue = useAggregatedAccValue()

	const [lockPeriod, setLockPeriod] = useState(0)
	const [lockPeriodInDays, setLockPeriodInDays] = useState(7776000)
	const [multiplier, setMultiplier] = useState(0)
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
		cursor: (!doWithdrawal && phase.which === 2) ? 'pointer' : '',
		pointerEvents: (!doWithdrawal && phase.which === 2) ? 'all !important' : '',
	}

	const lock = () => {
		try {
			if (
				!(working)
			) {
				setWorking(true)
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				if (props.p.pair === 'HALO') {
					depositToPhase2(
						fromPhase1Pair.address,
						lockPeriodInDays,
						provider,
					)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then(() => {
								setWorking(false)
								phase2position.refetch()
								token0Balance.refetch()
								aggregatedAccValue.refetch()
							})
						})
						.catch(error => {
							setWorking(false)
							console.log(error)
						})
				}
				else {
					depositStable(
						token0Value,
						lockPeriodInDays,
						provider,
					)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then(() => {
								setWorking(false)
								phase2position.refetch()
								token0Balance.refetch()
								aggregatedAccValue.refetch()
							})
						})
						.catch(error => {
							setWorking(false)
							console.log(error)
						})
				}
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
				!(working)
			) {
				setWorking(true)
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				withdrawStable(
					token0Value,
					provider,
				)
					.then((tx) => {
						tx.wait(
							defaults.network.tx.confirmations,
						).then(() => {
							setWorking(false)
							phase2position.refetch()
							token0Balance.refetch()
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
		if (props.p.pair) {
			if (lockPeriod === 0) {
				setLockPeriodInDays(7776000)
				setMultiplier(props.p.pair === 'HALO' ? 1 : 4)
			}
			if (lockPeriod === 1) {
				setLockPeriodInDays(15552000)
				setMultiplier(props.p.pair === 'HALO' ? 3 : 9)
			}
			if (lockPeriod === 2) {
				setLockPeriodInDays(31536000)
				setMultiplier(props.p.pair === 'HALO' ? 7 : 19)
			}
		}
	}, [
		props.p.pair,
		lockPeriod,
	])

	useEffect(() => {
		if (props.p.pair) {
			if (phase2position.data) {
				console.log(phase2position.data[1])
				if (phase2position.data[1].toNumber() === 0) {
					setLockPeriod(0)
				}
				if (phase2position.data[1].toNumber() === 4 ||
				phase2position.data[1].toNumber() === 1) {
					setLockPeriod(0)
				}
				if (phase2position.data[1].toNumber() === 9 ||
				phase2position.data[1].toNumber() === 3) {
					setLockPeriod(1)
				}
				if (phase2position.data[1].toNumber() === 19 ||
				phase2position.data[1].toNumber() === 7) {
					setLockPeriod(2)
				}
			}
		}
	}, [
		phase2position.data?.[1],
	])

	useEffect(() => {
		return () => {
			setToken0Amount('')
			setToken0Value('')
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
							{props.p.pair === 'HALO' &&
								<>
									<Box
										as='h4'
										textStyle='heading'
									>
										Source pool
									</Box>
									<Flex
										flexDir='column'
										mt='5px'
										mb='1.34rem'
									>
										<Menu>
											<MenuButton
												as={Button}
												variant='solidAlt'
												textAlign='left'
												rightIcon={<ChevronDownIcon />}
											>
												{!fromPhase1Pair.pair &&
													<>
														Select pool
													</>
												}
												{fromPhase1Pair &&
													<>
														<Flex
															gap='0.24rem'
														>
															{fromPhase1Pair.token0 &&
															<Image
																src={`/svg/tokens/${fromPhase1Pair.token0}/index.svg`}
																layerStyle='tokenIconSmall'
															/>
															}
															{fromPhase1Pair.token1 &&
															<Image
																src={`/svg/tokens/${fromPhase1Pair.token1}/index.svg`}
																layerStyle='tokenIconSmall'
															/>
															}
															<Flex
																ml='0.10rem'
															>
																{fromPhase1Pair.pair}
															</Flex>
														</Flex>
													</>
												}
											</MenuButton>
											<MenuList
												minW='336px'
											>
												{defaults
													?.lockdropPairs
													?.filter(p => p.phase === 1)
													.map(p => {
														return <Phase1PoolItem
															key={p.pair}
															setFromPhase1Pair={setFromPhase1Pair}
															p={p}
														/>
													})
												}
											</MenuList>
										</Menu>
									</Flex>
								</>
							}
							<Box
								as='h4'
								mb={props.p.pair === 'HALO' ? '1rem' : ''}
								textStyle='heading'
							>
								Amount
								{props.p.pair === 'HALO' &&
									<Flex
										{...extrasStyle}
									>
										{!fromPhase1Value.data &&
											<>
												0
											</>
										}
										{fromPhase1Value.data &&
											<>
												{prettifyNumber(ethers.utils.formatEther(fromPhase1Value.data), 0, 4, 'US')}
											</>
										}
										<Image
											src={`svg/tokens/${defaults.address.halo}/index.svg`}
											ml='0.2rem'
											layerStyle='tokenIcon'
										/>
									</Flex>
								}
							</Box>
							{props.p.pair !== 'HALO' &&
								<>
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
													handleTokenInput(
														setToken0Amount,
														setToken0Value,
														e,
														token0Resolved,
													)
												}}
											/>
											<InputRightElement {...rightElementStyle}>
												{(token0Resolved?.isLoading) &&
													<Spinner />
												}
												{(!token0Resolved?.isLoading) &&
													<>
														<Image
															layerStyle='tokenImage'
															src={token0Resolved?.data?.logoURI}
														/>
														<Box
															layerStyle='tokenSymbol'
														>
															{token0Resolved?.data?.symbol}
														</Box>
													</>
												}
											</InputRightElement>
										</InputGroup>
										<Flex
											layerStyle='ncGroup'
										>
											<Button
												{...ncButtonProps}
												onClick={() => {
													if (wallet.account) {
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2].div(100).mul(25) :
																	props.p.pair === 'HALO' ? aggregatedAccValue.total.div(100).mul(25) :
																		token0Balance?.data?.div(100).mul(25),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2].div(100).mul(25) :
																props.p.pair === 'HALO' ? aggregatedAccValue.total.div(100).mul(25) :
																	token0Balance?.data?.div(100).mul(25),
														)
													}
												}}
											>25%</Button>
											<Button
												{...ncButtonProps}
												onClick={() => {
													if (wallet.account) {
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2].div(100).mul(50) :
																	props.p.pair === 'HALO' ? aggregatedAccValue.total.div(100).mul(50) :
																		token0Balance?.data?.div(100).mul(50),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2].div(100).mul(50) :
																props.p.pair === 'HALO' ? aggregatedAccValue.total.div(100).mul(50) :
																	token0Balance?.data?.div(100).mul(50),
														)
													}
												}}
											>50%</Button>
											<Button
												{...ncButtonProps}
												onClick={() => {
													if (wallet.account) {
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2].div(100).mul(75) :
																	props.p.pair === 'HALO' ? aggregatedAccValue.total.div(100).mul(75) :
																		token0Balance?.data?.div(100).mul(75),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2].div(100).mul(75) :
																props.p.pair === 'HALO' ? aggregatedAccValue.total.div(100).mul(75) :
																	token0Balance?.data?.div(100).mul(75),
														)
													}
												}}
											>75%</Button>
											<Button
												{...ncButtonProps}
												onClick={() => {
													if (wallet.account) {
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2] :
																	props.p.pair === 'HALO' ? aggregatedAccValue.total :
																		token0Balance?.data,
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2] :
																props.p.pair === 'HALO' ? aggregatedAccValue.total :
																	token0Balance?.data,
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
							{phase.which !== 2 &&
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
										Phase 2 is over
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
								textStyle='heading'
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
								cursor={(!doWithdrawal && phase.which === 2) ? 'pointer' : 'not-allowed'}
							>
								<Slider
									defaultValue={0}
									min={0}
									max={2}
									disabled={(!doWithdrawal && phase.which === 2) ? false : true}
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
											opacity={(!doWithdrawal && phase.which === 2) ? '' :
												(lockPeriod === 0) ? '1' : '0.6'}
											onClick={() => { if (!doWithdrawal) { setLockPeriod(0) }}}
											{...markLabelStyle}>
											90<br/>days
										</SliderMark>
										<SliderMark
											value={1}
											opacity={(!doWithdrawal && phase.which === 2) ? '' :
												(lockPeriod === 1) ? '1' : '0.6'}
											onClick={() => { if (!doWithdrawal) { setLockPeriod(1) }}}
											{...markLabelStyle}
										>
											180<br/>days
										</SliderMark>
										<SliderMark
											value={2}
											opacity={(!doWithdrawal && phase.which === 2) ? '' :
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
									textStyle='heading'
								>
									REWARD
									<Flex
										{...extrasStyle}
									>
										{/* <Skeleton
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
										</Skeleton> */}
									</Flex>
								</Box>
								<Box
									as='h4'
									mb='1rem'
									textStyle='heading'
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
								textStyle='heading'
							>
								Deposited
							</Box>
							<Skeleton
								flexFlow='column'
								marginBottom='1.34rem'
								gridGap='0.35rem'
								isLoaded={(!token0Resolved.isLoading) || (!phase2position.isLoading)}
							>
								<Flex
									layerStyle='tokenAmountDepositedRow'
									background={colorMode === 'light' ? '#eddcbc' : '#212121'}
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
										phase2position.data &&
											prettifyNumber(
												ethers.utils.formatUnits(
													phase2position.data?.[2],
													token0Resolved.data?.decimals,
												),
												2, 10, 'US')
										}
									</Flex>
								</Flex>
							</Skeleton>
							{(
								token0Resolved?.data &&
								token0Value &&
									(
										((token0Allowance?.data?.lte(0))) ||
										((token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval))))
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
										{`Allow ${token0Resolved?.data?.symbol}
										`}
									</Box>
									<Box
										as='p'
										ml='4px'
									>
										{`In order to be able to lock, it's neccesary to allow interaction with ${token0Resolved?.data?.symbol} token.`}
									</Box>
									<Button
										w='100%'
										variant='solid'
										isLoading={working}
										onClick={() => {
											setWorking(true)
											const provider = new ethers.providers.Web3Provider(wallet.ethereum)
											approveERC20ToSpend(
												token0Resolved?.data?.address,
												defaults.address.phase2,
												defaults.network.erc20.maxApproval,
												provider,
											)
												.then((tx) => {
													tx.wait(defaults.network.tx.confirmations)
														.then(() => {
															token0Allowance?.refetch()
															setWorking(false)
														})
														.catch(() => setWorking(false))
												})
												.catch(() => setWorking(false))
										}}
									>
										<Image
											layerStyle='tokenImage'
											src={token0Resolved?.data?.logoURI}
										/>
											Allow
										<Box
											ml='5px'
											layerStyle='tokenSymbol'
										>
											{token0Resolved?.data?.symbol}
										</Box>
									</Button>
								</Flex>
							}
							{phase.which === 2 &&
								<Button
									w='100%'
									isLoading={(token0Allowance?.data?.gt(0) &&
										token0Allowance?.data?.gt(token0Value ? token0Value : 0)) ? working : false}
									loadingText={ !doWithdrawal ? 'Depositing' : 'Withdrawing'}
									disabled={!(fromPhase1Pair) || (
										token0Value &&
										token0Amount) ||
										(!(
											((props.p.pair === 'HALO')) && (fromPhase1Pair) && (fromPhase1Value.data) && (fromPhase1Value.data.gt(0)) ||
											((!doWithdrawal) && (token0Balance?.data) && (token0Value) && (token0Value.gt(0)) && token0Value.lte(token0Balance?.data)) ||
											((doWithdrawal) && (phase2position?.data) && (token0Value) && (token0Value.gt(0)) && token0Value.lte(phase2position?.data[2])) &&
											(token0Allowance?.data?.gt(0) &&
												token0Allowance?.data?.gt(token0Value ? token0Value : 0)) &&
											!(working)
										))
									}
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
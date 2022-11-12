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
import { depositStable, withdrawStable } from '../../common/phase2'
import { useUnknownERC20Resolve, useERC20Allowance, useERC20Balance,
	useAggregatedAccValue, usePhase, usePhase2Position } from '../../hooks'

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
	const [doWithdrawal, setDoWithdrawal] = useState(false)

	const aggregatedAccValue = useAggregatedAccValue()

	const [lockPeriod, setLockPeriod] = useState(0)
	const [lockPeriodInDays, setLockPeriodInDays] = useState(7776000)
	const [multiplier, setMultiplier] = useState(0)
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
		cursor: (!doWithdrawal && phase.which === 2) ? 'pointer' : '',
		pointerEvents: (!doWithdrawal && phase.which === 2) ? 'all !important' : '',
	}

	const depositedRowStyle = {
		justifyContent: 'space-between',
		borderRadius: '0.34rem',
		padding: '4px 5px',
	}

	const lock = () => {
		try {
			if (
				!(working)
			) {
				setWorking(true)
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
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
				if (phase2position.data?.[1]?.toNumber() === (0)) {
					setLockPeriod(0)
				}
				if (phase2position.data?.[1]?.toNumber() === (4 || 1)) {
					setLockPeriod(0)
				}
				if (phase2position.data?.[1]?.toNumber() === (9 || 3)) {
					setLockPeriod(1)
				}
				if (phase2position.data?.[1]?.toNumber() === (19 || 7)) {
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
							{phase.which === 2 &&
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
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2].div(100).mul(25) :
																 token0Balance?.data?.div(100).mul(25),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2].div(100).mul(25) :
																token0Balance?.data?.div(100).mul(25),
														)
													}
												}}
											>25%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2].div(100).mul(50) :
																	token0Balance?.data?.div(100).mul(50),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2].div(100).mul(50) :
																token0Balance?.data?.div(100).mul(50),
														)
													}
												}}
											>50%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2].div(100).mul(75) :
																	token0Balance?.data?.div(100).mul(75),
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2].div(100).mul(75) :
																token0Balance?.data?.div(100).mul(75),
														)
													}
												}}
											>75%</Button>
											<Button
												{...ncButtonStyle}
												onClick={() => {
													if (wallet.account) {
														setToken0Amount(
															ethers.utils.formatUnits(
																doWithdrawal ? phase2position.data?.[2] :
																	token0Balance?.data,
																token0Resolved?.data?.decimals,
															),
														)
														setToken0Value(
															doWithdrawal ? phase2position.data?.[2] :
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
									{...noteStyle}
								>
									<Box
										as='h4'
										m='0'
										p='0'
										{...headingStyle}
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
									{...headingStyle}
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
								isLoaded={(!token0Resolved.isLoading) || (!phase2position.isLoading)}
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
									{...noteStyle}
								>
									<Box
										as='h4'
										m='0'
										p='0'
										{...headingStyle}
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
											{...tokenImageStyle}
											src={token0Resolved?.data?.logoURI}
										/>
											Allow
										<Box
											ml='5px'
											{...tokenSymbolStyle}
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
									disabled={!(
										token0Value &&
										token0Amount) ||
										(!(
											(token0Value?.lte(token0Balance?.data ? token0Balance?.data : 0)) &&
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
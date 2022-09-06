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
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { defaults, handleTokenInput, approveERC20ToSpend } from '../../common'
import { deposit } from '../../common/phase1'
import { useUnknownERC20Resolve, useERC20Allowance, useUniV2TokenQuantity, useERC20Balance } from '../../hooks'

export const LockModal = (props) => {
	LockModal.propTypes = {
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
	const [token0Amount, setToken0Amount] = useState('')
	const [token0Value, setToken0Value] = useState(ethers.BigNumber.from(0))
	const [token1Amount, setToken1Amount] = useState('')
	const [token1Value, setToken1Value] = useState(ethers.BigNumber.from(0))
	const uniV2TokenQuantity = useUniV2TokenQuantity(props.p.address,
		token0Value, token1Value,
		token0Resolved.data?.decimals, token1Resolved.data?.decimals)
	const [lockPeriod, setLockPeriod] = useState(0)
	const [lockPeriodInDays, setLockPeriodInDays] = useState(7776000)
	const [working, setWorking] = useState(false)
	const wallet = useWallet()

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

	const markLabelStyle = {
		mt: '2',
		ml: '-3.5',
		fontSize: 'sm',
		textAlign: 'center',
		cursor: 'pointer',
		pointerEvents: 'all !important',
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
						).then((r) => {
							setWorking(false)
							token0Balance?.refetch()
							token1Balance?.refetch()
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
		if (token0Value.eq(uniV2TokenQuantity.token0Quantity)) {
			uniV2TokenQuantity.setVsync(true)
			setToken1Amount(ethers.utils.formatUnits(uniV2TokenQuantity.token1Quantity, token1Resolved.data?.decimals))
			setToken1Value(uniV2TokenQuantity?.token1Quantity)
		}
	}, [
		uniV2TokenQuantity.token1Quantity,
		uniV2TokenQuantity.token1Price,
	])

	useEffect(() => {
		if (token1Value.eq(uniV2TokenQuantity.token1Quantity)) {
			uniV2TokenQuantity.setVsync(true)
			setToken0Amount(ethers.utils.formatUnits(uniV2TokenQuantity.token0Quantity, token0Resolved.data?.decimals))
			setToken0Value(uniV2TokenQuantity?.token0Quantity)
		}
	}, [
		uniV2TokenQuantity.token0Quantity,
		uniV2TokenQuantity.token0Price,
	])

	useEffect(() => {
		if (lockPeriod === 0) setLockPeriodInDays(7776000)
		if (lockPeriod === 1) setLockPeriodInDays(15552000)
		if (lockPeriod === 2) setLockPeriodInDays(31536000)
	}, [lockPeriod])

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
					<ModalHeader>{`Lock ${props.p.pair}`}</ModalHeader>
					<ModalCloseButton top={defaults.layout.modal.closeButton.top} />
					<ModalBody minH={defaults.layout.modal.body.minH}>
						<Box
							p='3px 1.5rem 1.5rem'
						>
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
										{token0Resolved.isLoading &&
											<Spinner />
										}
										{!token0Resolved.isLoading &&
											<>
												<Image
													{...tokenImageStyle}
													src={token0Resolved.data?.logoURI}
												/>
												<Box {...tokenSymbolStyle}>
													{token0Resolved.data?.symbol}
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
														token0Balance?.data?.div(100).mul(25),
														token0Resolved.data?.decimals,
													),
												)
												setToken0Value(
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
														token0Balance?.data?.div(100).mul(50),
														token0Resolved.data?.decimals,
													),
												)
												setToken0Value(
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
														token0Balance?.data?.div(100).mul(75),
														token0Resolved.data?.decimals,
													),
												)
												setToken0Value(
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
														token0Balance?.data,
														token0Resolved.data?.decimals,
													),
												)
												setToken0Value(
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
										{token1Resolved.isLoading &&
											<Spinner />
										}
										{!token1Resolved.isLoading &&
											<>
												<Image
													{...tokenImageStyle}
													src={token1Resolved.data?.logoURI}
												/>
												<Box {...tokenSymbolStyle}>
													{token1Resolved.data?.symbol}
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
														token1Balance?.data?.div(100).mul(50),
														token1Resolved.data?.decimals,
													),
												)
												setToken1Value(
													token1Balance?.data?.div(100).mul(50),
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
														token1Balance?.data?.div(100).mul(50),
														token1Resolved.data?.decimals,
													),
												)
												setToken1Value(
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
														token1Balance?.data?.div(100).mul(75),
														token1Resolved.data?.decimals,
													),
												)
												setToken1Value(
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
														token1Balance?.data,
														token1Resolved.data?.decimals,
													),
												)
												setToken1Value(
													token1Balance?.data,
												)
											}
										}}
									>Max</Button>
								</Flex>
							</Flex>
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
							>
								<Slider
									defaultValue={0}
									min={0}
									max={2}
									step={1}
									value={lockPeriod}
									onChange={(n) => setLockPeriod(n)}
								>
									<Box
										mt='15px'
										p='0 10px'
									>
										<SliderMark
											pointerEvents='all'
											value={0}
											onClick={() => setLockPeriod(0)}
											{...markLabelStyle}>
											90<br/>days
										</SliderMark>
										<SliderMark
											value={1}
											onClick={() => setLockPeriod(1)}
											{...markLabelStyle}
										>
											180<br/>days
										</SliderMark>
										<SliderMark
											value={2}
											onClick={() => setLockPeriod(2)}
											cursor='pointer'
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
							{(
								(token0Resolved.data && token1Resolved.data) &&
									(
										((token0Allowance?.data?.lte(0)) ||
										(token1Allowance?.data?.lte(0))) ||
										((token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval))) ||
										(token1Allowance?.data?.lt(token1Value) && token1Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval))))
									)
							 ) &&
								<Flex
									flexDir='column'
									flexWrap='wrap'
									mb='1rem'
									bg='#7D786E26'
									p='1rem'
									borderRadius='0.5rem'
									gap='0.3rem'
								>
									<Box
										as='h4'
										m='0'
										p='0'
										{...headingStyle}
									>
										{`Allow ${token0Allowance?.data?.lte(0) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ||
										  token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ?
											token0Resolved.data?.symbol :
											token1Resolved.data?.symbol}
										`}
									</Box>
									<Box
										as='p'
										ml='4px'
									>
										{`In order to be able to lock, it's neccesary to allow interaction with ${token0Allowance?.data?.lte(0) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ||
										  token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ?
											token0Resolved.data?.symbol :
											token1Resolved.data?.symbol} token.`}
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
												token0Allowance?.data?.lt(token0Value) && token0Value.lte(ethers.BigNumber.from(defaults.network.erc20.maxApproval)) ? token0Resolved.data?.address : token1Resolved.data?.address,
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
													token0Resolved.data?.logoURI :
													token1Resolved.data?.logoURI
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
													token0Resolved.data?.symbol :
													token1Resolved.data?.symbol
											}
										</Box>
									</Button>
								</Flex>
							}
							<Button
								w='100%'
								disabled={
									!((token0Allowance?.data?.gt(0) &&
										token0Allowance?.data?.gt(token0Value)) &&
									(token1Allowance?.data?.gt(0) &&
										token1Allowance?.data?.gt(token1Value)) &&
									!(working))
								}
								isLoading={working}
								loadingText='Locking'
								onClick={() => lock(wallet.account)}
							>
								Lock assets
							</Button>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
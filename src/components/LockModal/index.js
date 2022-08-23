import React, { useState } from 'react'
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
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { defaults, handleTokenInput, approveERC20ToSpend } from '../../common'
import { useUnknownERC20Resolve, useERC20Allowance } from '../../hooks'

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
	const [token0Amount, setToken0Amount] = useState('')
	const [token0Value, setToken0Value] = useState(ethers.BigNumber.from(0))
	const [token1Amount, setToken1Amount] = useState('')
	const [token1Value, setToken1Value] = useState(ethers.BigNumber.from(0))
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
		paddingRight: '7.6rem',
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

	console.log(token0Allowance)

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
										onChange={(e) =>
											handleTokenInput(
												setToken0Amount,
												setToken0Value,
												e,
												token0Resolved,
											)
										}
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
								<InputGroup {...groupStyle}>
									<Input
										{...inputStyle}
										value={token1Amount}
										onChange={(e) =>
											handleTokenInput(
												setToken1Amount,
												setToken1Value,
												e,
												token1Resolved,
											)
										}
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
							</Flex>
							{(
								(token0Resolved.data && token1Resolved.data) &&
									(
										((token0Allowance?.data?.lte(0)) ||
										(token1Allowance?.data?.lte(0))) ||
										((token0Allowance?.data?.lt(token0Value)) ||
										(token1Allowance?.data?.lt(token1Value)))
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
										{`Allow ${token0Allowance?.data?.lte(0) ||
										  token0Allowance?.data?.lt(token0Value) ?
											token0Resolved.data?.symbol :
											token1Resolved.data?.symbol}
										`}
									</Box>
									<Box
										as='p'
										ml='4px'
									>
										{`In order to be able to lock, it's neccesary to allow interaction with ${token0Allowance?.data?.lte(0) ||
										  token0Allowance?.data?.lt(token0Value) ?
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
												token0Allowance?.data?.lte(0) ||
												token0Allowance?.data?.lt(token0Value) ? token0Resolved.data?.address : token1Resolved.data?.address,
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
												token0Allowance?.data?.lte(0) ||
												token0Allowance?.data?.lt(token0Value) ?
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
												token0Allowance?.data?.lte(0) ||
												token0Allowance?.data?.lt(token0Value) ?
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
										token1Allowance?.data?.gt(token1Value)))
								}
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

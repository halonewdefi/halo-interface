import React from 'react'
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
import { defaults } from '../../common'
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
	const token1Allowance = useERC20Allowance(props.p.token0, defaults.address.phase1)

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
									<Input {...inputStyle}/>
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
									<Input {...inputStyle}/>
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
								((token0Allowance?.data <= 0) ||
								(token1Allowance?.data <= 0)) &&
								(token0Resolved.data && token1Resolved.data)
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
										{`Allow ${token0Allowance?.data <= 0 ?
											token0Resolved.data?.symbol :
											token1Resolved.data?.symbol}
										`}
									</Box>
									<Box
										as='p'
										ml='4px'
									>
										{`In order to be able to lock, it's neccesary to allow interaction with ${token0Allowance?.data <= 0 ?
											token0Resolved.data?.symbol :
											token1Resolved.data?.symbol} token.`}
									</Box>
									<Button
										w='100%'
										variant='solid'
									>
										<Image
											{...tokenImageStyle}
											src={token0Allowance?.data <= 0 ?
												token0Resolved.data?.logoURI :
												token1Resolved.data?.logoURI}
										/>
									Allow
										<Box
											ml='5px'
											{...tokenSymbolStyle}>
											{token0Allowance?.data <= 0 ?
												token0Resolved.data?.symbol :
												token1Resolved.data?.symbol}
										</Box>
									</Button>
								</Flex>
							}
							<Button
								w='100%'
								disabled
							>Lock assets</Button>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}

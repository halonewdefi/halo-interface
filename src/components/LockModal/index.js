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
} from '@chakra-ui/react'
import { defaults } from '../../common'
import { useUnknownERC20Resolve } from '../../hooks'

export const LockModal = (props) => {
	LockModal.propTypes = {
		p: PropTypes.object.isRequired,
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
	}

	const token0Resolved = useUnknownERC20Resolve(props.p.token0)
	const token1Resolved = useUnknownERC20Resolve(props.p.token1)

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
								Assets
							</Box>
							<Flex
								flexDir='column'
								flexWrap='wrap'
								gap='9px'
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
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}

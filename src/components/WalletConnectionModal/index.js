import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { defaults } from '../../common'
import { useWallet } from 'use-wallet'
import {
	Modal,
	ModalHeader,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Image,
	Text,
	useToast,
} from '@chakra-ui/react'
import { walletNotConnected } from '../../messages'

export const WalletConnectionModal = props => {
	WalletConnectionModal.propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		setWorking: PropTypes.func.isRequired,
	}
	const wallet = useWallet()
	const toast = useToast()
	const wallets = Object.values(defaults.network.connectors).map(
		item => item.meta,
	)

	useEffect(() => {
		if (wallet.error) {
			return toast({
				...walletNotConnected,
				description: wallet.error.message,
			})
		}
	}, [wallet.error])

	const connect = key => {
		props.onClose()
		props.setWorking(true)
		wallet
			.connect(key)
			.catch(err => {
				console.log(err)
				toast({
					...walletNotConnected,
					description: err.message,
				})
			})
			.finally(() => {
				props.setWorking(false)
			})
	}

	return (
		<>
			<Modal
				onClose={props.onClose}
				isOpen={props.isOpen}
				autoFocus={false}
				scrollBehavior='inside'
				size='xl'
				motionPreset={{ base: 'slideInBottom', md: '' }}
			>
				<ModalOverlay />
				<ModalContent overflow='hidden'>
					<ModalHeader>Connect Wallet</ModalHeader>
					<ModalCloseButton top={defaults.layout.modal.closeButton.top} />
					<ModalBody minH={defaults.layout.modal.body.minH}>
						<Box
							p='3px 1.5rem 1.5rem'>
							<Grid
								templateColumns={{
									base: 'repeat(1, 1fr)',
									md: 'repeat(3, 1fr)',
								}}
								gap={3}>
								{wallets.map(w => (
									<GridItem
										key={w.name}>
										<Button
											variant='modalCentricLarge'
											display='flex'
											width='100%'
											flexDir={{ base: 'row', md: 'column' }}
											alignItems='center'
											onClick={() => connect(w.key)}
										>
											<Flex minH='50px'>
												<Image src={w.logo} alt={`${w.name} logo`} width='50px'/>
											</Flex>
											<Text
												mt={{ base: '0', md: '0.5rem' }}
												ml={{ base: '0.5rem', md: '0' }}>
												{w.name}
											</Text>
										</Button>
									</GridItem>
								))}
							</Grid>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}

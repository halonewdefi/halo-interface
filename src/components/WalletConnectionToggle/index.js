import React, { useRef, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import { Menu, MenuButton, Button, Portal, MenuList,
	MenuItem } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { prettifyAddress } from '../../common'
import Jazzicon from '@metamask/jazzicon'
import { WalletConnectionModal } from '../../components'

export const WalletConnectionToggle = props => {
	const initialText = 'Connect'
	const wallet = useWallet()
	const ref = useRef()
	const [working, setWorking] = useState(false)
	const [text, setText] = useState(initialText)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggle = () => {
		if (!wallet.account) {
			setIsModalOpen(true)
		}
		else {
			setIsMenuOpen(true)
		}
	}

	const prettyAccount = prettifyAddress(wallet?.account, 4)

	useEffect(() => {
		if (!working) {
			if (wallet.account !== null) {
				setText(prettyAccount)
				ref.current.appendChild(
					Jazzicon(16, parseInt(wallet.account.slice(2, 10), 16)),
				).style.marginLeft = '7px'
				// toast(connected)
			}
			return () => {
				if (wallet.account) {
					if (ref.current) ref.current.getElementsByTagName('div')[0].remove()
					setText(initialText)
				}
			}
		}
	}, [wallet.account, working])

	return (
		<>
			<Menu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				closeOnEsc={true}
				closeOnBlur={true}
				matchWidth={true}
				placement={'bottom-end'}
				autoSelect={false}
			>
				<MenuButton
					as={Button}
					size='md'
					minWidth='initial'
					fontSize={{ base: '0.65rem', sm: 'sm' }}
					variant={wallet.account ? 'solidAlt' : 'solid'}
					aria-label='Wallet Connection Status'
					isLoading={working}
					onClick={toggle}
					display='flex'
					flexDirection='row'
					ref={ref}
					{...props}
					style={{
						textAlign: 'center',
					}}
				>
					<span
						style={{
							order: '-1',
						}}
					>
						{text}
					</span>
				</MenuButton>
				<Portal>
					<MenuList
						zIndex={{ base: '2', md: '1' }}>
						<MenuItem
							icon={<CloseIcon />}
							onClick={() => wallet?.reset()}
						>
      				Disconnect
						</MenuItem>
					</MenuList>
				</Portal>
			</Menu>
			<WalletConnectionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false) & setWorking(false)}
				setWorking={setWorking}
			/>
		</>
	)
}

import React, { useState, useRef, useEffect } from 'react'
import {
	Flex,
	Box,
	Image,
	Skeleton,
	Button,
} from '@chakra-ui/react'
import { useWallet } from 'use-wallet'
import { prettifyAddress, prettifyNumber } from '../../common'
import Jazzicon from '@metamask/jazzicon'
import { defaults } from '../../common'

export const AccountOverview = (props) => {

	const wallet = useWallet()
	const prettyAccount = prettifyAddress(wallet?.account, 4)
	const ref = useRef()

	const descStyle = {
		fontWeight: '600',
		mb: '0',
	}

	const tokeIconStyle = {
		h: 'auto',
		w: '38px',
		paddingTop: '8px',
	}

	useEffect(() => {
		if (wallet.account !== null) {
			ref.current.appendChild(
				Jazzicon(86, parseInt(wallet?.account?.slice(2, 10), 16)),
			).style.borderRadius = '0.34rem'
		}
		return () => {
			if (wallet.account) {
				if (ref.current.getElementsByTagName('div')[0]) {
					ref.current.getElementsByTagName('div')[0].remove()
				}
			}
		}
	}, [wallet.account])

	return (
		<Flex
			flexDir='column'
			w='100%'
			p='2rem 0 2rem 0'
			alignItems='flex-start'
			gap='1.3rem'
		>
			<Flex
				flexDir='row-reverse'
				justifyContent='left'
				gap='16px'
			>
				<Flex
					flexDir='column'
				>
					<Skeleton
						isLoaded={!!wallet.account}
					>
						<Box
							height='27px'
						>
							<Box
								as='h4'
								paddingTop='0'
								lineHeight='27px'
								{...descStyle}>
								{prettyAccount}
							</Box>
						</Box>
					</Skeleton>
					<Flex
						flexDir='row'
						gap='.2rem'
					>
						<Box
							lineHeight='1'
							fontSize='2.9rem'
							wordBreak='break-all'
						>
							{prettifyNumber('2000000', 2, 2, 'US')}
						</Box>
						<Image
							{...tokeIconStyle}
							src={`svg/tokens/${defaults.address.halo}/index.svg`}/>
					</Flex>
					Account value
				</Flex>
				<Skeleton
					isLoaded={!!wallet.account}
				>
					<Flex
						height='97.4px'
						width='86px'
					>
						<Flex
							height='97.4px'
							alignItems='center'
							ref={ref}
						/>
					</Flex>
				</Skeleton>
			</Flex>
			<Button
				size='md'
				variant='solid'
				disabled={wallet.account ? false : true}
			>
    		Claim rewards
			</Button>
		</Flex>
	)
}
